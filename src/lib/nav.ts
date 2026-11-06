import { router, useNavigation } from 'expo-router';

type Href = { pathname: string; params: { id: string } & Record<string, string> };
type StackState = { index: number; routes: { name: string; params?: { id?: string } }[] };

/**
 * Opens a screen, unless that very screen is the one just behind this one: then it goes back to it instead.
 * Going book page → reader → main ideas → reader… would otherwise stack a new copy each time, and you'd have
 * to go back through every one of them to get home.
 */
export function usePushOrBack() {
  const navigation = useNavigation();
  return (href: Href) => {
    const state = navigation.getState() as StackState | undefined;
    const previous = state && state.index > 0 ? state.routes[state.index - 1] : undefined;
    if (previous && previous.name === href.pathname.replace(/^\//, '') && previous.params?.id === href.params.id) {
      router.back();
      return;
    }
    router.push(href as never);
  };
}
