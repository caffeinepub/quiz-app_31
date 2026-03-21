import { useQuery } from "@tanstack/react-query";
import type { Category, Question } from "../backend.d";
import { useActor } from "./useActor";

export function useGetCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetQuestionsByCategory(categoryId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Question[]>({
    queryKey: ["questions", categoryId],
    queryFn: async () => {
      if (!actor || !categoryId) return [];
      return actor.getQuestionsByCategory(categoryId);
    },
    enabled: !!actor && !isFetching && !!categoryId,
  });
}
