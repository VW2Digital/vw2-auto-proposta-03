/** Limpa cache de conteúdo CMS na sessão (chaves `nexo:`). */
export function clearCmsSessionCache() {
  try {
    const keys = []
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const key = sessionStorage.key(i)
      if (key?.startsWith('nexo:')) keys.push(key)
    }
    keys.forEach((key) => sessionStorage.removeItem(key))
  } catch {
    /* private mode */
  }
}

/** Se a URL pediu refresh, limpa o cache antes do React montar. */
export function clearCmsCacheIfRefreshRequested() {
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.has('_refresh')) {
      clearCmsSessionCache()
    }
  } catch {
    /* ignore */
  }
}
