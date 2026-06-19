import { useCallback, useEffect, useRef, useState } from "react";

// Cache em memória: persiste enquanto o bundle vive, zera ao recarregar.
const cache = new Map<string, unknown>();

type AsyncState<T> = {
  data: T | undefined;
  loading: boolean;
  error: string | undefined;
  reload: () => void;
};

/**
 * Executa uma função assíncrona controlando loading/erro.
 * Se `cacheKey` for fornecido, exibe o dado em cache imediatamente (stale-while-revalidate):
 * - Se já tem cache → não mostra spinner, atualiza em background.
 * - Se não tem cache → mostra spinner normalmente.
 * Resultado: ao voltar para uma tela já visitada, aparece instantaneamente.
 */
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[] = [],
  cacheKey?: string
): AsyncState<T> {
  const cached = cacheKey ? (cache.get(cacheKey) as T | undefined) : undefined;
  const [data, setData] = useState<T | undefined>(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | undefined>(undefined);
  const mounted = useRef(true);

  const run = useCallback(async () => {
    // Se já temos dado em cache, revalida silenciosamente (sem spinner visível)
    if (!data) setLoading(true);
    setError(undefined);
    try {
      const result = await fn();
      if (!mounted.current) return;
      if (cacheKey) cache.set(cacheKey, result);
      setData(result);
    } catch (e: any) {
      if (!mounted.current) return;
      setError(e?.response?.data?.message ?? e?.message ?? "Erro ao carregar");
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mounted.current = true;
    run();
    return () => { mounted.current = false; };
  }, [run]);

  return { data, loading, error, reload: run };
}
