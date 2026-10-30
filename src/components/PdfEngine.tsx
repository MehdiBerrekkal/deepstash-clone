import { useEffect, useRef, type ComponentType, type Ref } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent, type WebViewProps } from 'react-native-webview';

/** Renders PDF pages to images with pdf.js: directly in the browser, inside a hidden WebView on iOS and Android. */
export type PdfApi = {
  /** Loads a PDF and resolves to its page count. */
  open: (data: { base64?: string; bytes?: ArrayBuffer }) => Promise<number>;
  /** Renders a page (0-based) at a pixel width; ratio is the page's height / width. */
  render: (page: number, width: number) => Promise<{ uri: string; ratio: number }>;
};

// react-native-webview's class typings don't match React 19's; this is the same component with plain props.
const NativeWebView = WebView as unknown as ComponentType<WebViewProps & { ref?: Ref<WebView> }>;

const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/** The same small program runs in the browser (via a script tag) and inside the native WebView. */
const ENGINE_JS = `
  pdfjsLib.GlobalWorkerOptions.workerSrc = ${JSON.stringify(WORKER)};
  var doc = null;
  async function pdfHandle(m) {
    if (m.type === 'open') {
      var data = m.bytes ? new Uint8Array(m.bytes) : Uint8Array.from(atob(m.base64), function (c) { return c.charCodeAt(0); });
      doc = await pdfjsLib.getDocument({ data: data }).promise;
      return doc.numPages;
    }
    var page = await doc.getPage(m.page + 1);
    var base = page.getViewport({ scale: 1 });
    var viewport = page.getViewport({ scale: m.width / base.width });
    var canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
    return { uri: canvas.toDataURL('image/jpeg', 0.86), ratio: base.height / base.width };
  }
`;

const NATIVE_HTML = `<!doctype html><html><head><meta name="viewport" content="width=device-width"></head><body>
<script src="${PDFJS}"></script>
<script>
${ENGINE_JS}
window.handle = function (m) {
  pdfHandle(m).then(
    function (result) { window.ReactNativeWebView.postMessage(JSON.stringify({ id: m.id, ok: true, result: result })); },
    function (e) { window.ReactNativeWebView.postMessage(JSON.stringify({ id: m.id, ok: false, error: String(e && e.message || e) })); }
  );
};
window.ReactNativeWebView.postMessage(JSON.stringify({ ready: !!window.pdfjsLib }));
</script></body></html>`;

let webEngine: Promise<(m: object) => Promise<unknown>> | null = null;

/** Loads pdf.js into the page once and returns its handler. */
function loadWebEngine() {
  webEngine ??= new Promise((resolve, reject) => {
    const g = globalThis as unknown as { pdfjsLib?: unknown; pdfHandle?: (m: object) => Promise<unknown> };
    const boot = () => {
      // Run the shared engine code with pdfjsLib in scope, then hand back its handler.
      const make = new Function('pdfjsLib', `${ENGINE_JS}; return pdfHandle;`) as (lib: unknown) => (m: object) => Promise<unknown>;
      resolve(make(g.pdfjsLib));
    };
    if (g.pdfjsLib) return boot();
    const script = document.createElement('script');
    script.src = PDFJS;
    script.onload = boot;
    script.onerror = () => {
      webEngine = null;
      reject(new Error('Could not load the PDF viewer. Check your internet connection.'));
    };
    document.head.appendChild(script);
  });
  return webEngine;
}

type Props = { onReady: (api: PdfApi) => void; onError?: (message: string) => void };

/** Mount once; it calls onReady with an API for opening and rendering PDFs. Invisible on every platform. */
export function PdfEngine({ onReady, onError }: Props) {
  const web = useRef<WebView>(null);
  const pending = useRef(new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>());
  const nextId = useRef(1);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    loadWebEngine().then(
      (handle) => onReadyRef.current({ open: (data) => handle({ type: 'open', ...data }) as Promise<number>, render: (page, width) => handle({ type: 'render', page, width }) as Promise<{ uri: string; ratio: number }> }),
      (e: Error) => onErrorRef.current?.(e.message),
    );
  }, []);

  if (Platform.OS === 'web') return null;

  const call = (message: object) =>
    new Promise<unknown>((resolve, reject) => {
      const id = nextId.current++;
      pending.current.set(id, { resolve, reject });
      web.current?.injectJavaScript(`window.handle(${JSON.stringify({ ...message, id })});true;`);
    });

  const onMessage = (e: WebViewMessageEvent) => {
    const msg = JSON.parse(e.nativeEvent.data) as { ready?: boolean; id?: number; ok?: boolean; result?: unknown; error?: string };
    if (msg.ready !== undefined) {
      if (!msg.ready) onErrorRef.current?.('Could not load the PDF viewer. Check your internet connection.');
      else
        onReadyRef.current({
          open: (data) => call({ type: 'open', base64: data.base64 }) as Promise<number>,
          render: (page, width) => call({ type: 'render', page, width }) as Promise<{ uri: string; ratio: number }>,
        });
      return;
    }
    const p = msg.id ? pending.current.get(msg.id) : undefined;
    if (!p) return;
    pending.current.delete(msg.id!);
    if (msg.ok) p.resolve(msg.result);
    else p.reject(new Error(msg.error || 'The PDF could not be rendered.'));
  };

  return (
    <View pointerEvents="none" style={styles.hidden}>
      <NativeWebView ref={web} originWhitelist={['*']} source={{ html: NATIVE_HTML, baseUrl: 'https://localhost/' }} onMessage={onMessage} javaScriptEnabled />
    </View>
  );
}

const styles = StyleSheet.create({
  hidden: { position: 'absolute', width: 2, height: 2, opacity: 0, left: -10, top: -10 },
});
