import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("getConfigWeb", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("devuelve el JSON de la API cuando la respuesta es OK", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ instagram: "https://instagram.com/ciclic" }),
    } as Response);
    const { getConfigWeb } = await import("./api");

    const config = await getConfigWeb();

    expect(config).toEqual({ instagram: "https://instagram.com/ciclic" });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("si la API falla, devuelve un objeto vacío en vez de tirar error", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network error"));
    const { getConfigWeb } = await import("./api");

    const config = await getConfigWeb();

    expect(config).toEqual({});
  });

  it("si la respuesta HTTP no es OK, devuelve un objeto vacío", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response);
    const { getConfigWeb } = await import("./api");

    const config = await getConfigWeb();

    expect(config).toEqual({});
  });
});

describe("getPromoModal", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("devuelve el JSON de la API cuando la respuesta es OK", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ activo: true, modelo: 2 }),
    } as Response);
    const { getPromoModal } = await import("./api");

    const config = await getPromoModal();

    expect(config).toEqual({ activo: true, modelo: 2 });
  });

  it("si la API falla, devuelve un objeto vacío en vez de tirar error", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network error"));
    const { getPromoModal } = await import("./api");

    const config = await getPromoModal();

    expect(config).toEqual({});
  });
});

describe("getEventos", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("mapea los campos crudos del backend al formato de UI", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          titulo: "Fiesta de Prueba",
          descripcion: "Descripción",
          imagen_portada: "https://example.com/portada.jpg",
          fecha: "2026-01-15",
          ubicacion: "Bariloche",
        },
      ],
    } as Response);
    const { getEventos } = await import("./api");

    const eventos = await getEventos();

    expect(eventos).toHaveLength(1);
    expect(eventos[0]).toMatchObject({
      id: 1,
      titulo: "Fiesta de Prueba",
      imagenTarjeta: "https://example.com/portada.jpg",
      imagenModal: "https://example.com/portada.jpg",
      tieneMesas: false,
      ubicacion: "Bariloche",
    });
    expect(eventos[0].fecha).toMatch(/ene/i);
  });

  it("si la API falla, devuelve un array vacío", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network error"));
    const { getEventos } = await import("./api");

    const eventos = await getEventos();

    expect(eventos).toEqual([]);
  });

  it("si la respuesta no es un array, devuelve un array vacío", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({}) } as Response);
    const { getEventos } = await import("./api");

    const eventos = await getEventos();

    expect(eventos).toEqual([]);
  });
});
