// types/midtrans-client.d.ts
declare module 'midtrans-client' {
  namespace midtransClient {
    class Snap {
      constructor(config: { isProduction: boolean; serverKey: string })
      createTransaction(params: Record<string, any>): Promise<{ token: string; redirect_url: string }>
    }

    class CoreApi {
      constructor(config: { isProduction: boolean; serverKey: string; clientKey: string })
      charge(params: Record<string, any>): Promise<any>
    }

    // Tambah class lainnya kalau kamu pakai
  }

  export = midtransClient
}
