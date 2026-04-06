import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Entry } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<Entry[]>({
    queryKey: ["entries", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetUserEntries(userId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Entry[]>({
    queryKey: ["entries", "user", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getUserEntries(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useCreateEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createEntry(userId, data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["entries", "user", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["entries", "all"] });
    },
  });
}

export function useLikeEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      entryId,
    }: { userId: string; entryId: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.likeEntry(userId, entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}

export function useDeleteEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      entryId,
      userId: _userId,
    }: { entryId: bigint; userId: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteEntry(entryId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["entries", "user", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["entries", "all"] });
    },
  });
}
