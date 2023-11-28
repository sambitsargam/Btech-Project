import {Blob, File, NFTStorage} from "nft.storage"

const useNftStorage = () => {
    const endpoint = "https://api.nft.storage" as any // the default
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDllMUUyY0YxODI2NTMwZDkyZThBM0I2MzFmMTRlQkUwQjUzMDYzMkIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzExNzA2MzAwNCwibmFtZSI6InZpZGVvIn0.I1N_3nisG99GDIIiOB9SzuzelA7A4DXLe-1TOs1L_4U";

    const storage = new NFTStorage({ endpoint, token })

    const uploadImage = async (file: File) => {
        const blob = new Blob([file], { type: "image/*" })
        return await storage.storeBlob(blob)
    }

    const uploadJson = async (json: any) => {
        const blob = new Blob([JSON.stringify(json)], { type: "application/json" })
        return await storage.storeBlob(blob)
    }

    const uploadText = async (text: string) => {
        return await storage.storeBlob(new Blob([text]))
    }

    return { uploadImage, uploadText, uploadJson }
}

export default useNftStorage