"use server";
import { useEdgeStore } from "@/lib/edgestore";
export async function deleteEdgeStore(img: any){
    const { edgestore } = useEdgeStore();
    await edgestore.publicFiles.delete({url: img,});
    return true;
}
export async function uploadEdgeStore(img: any){
    const { edgestore } = useEdgeStore();
    const res: any = await edgestore.publicFiles.upload({
        file: img
    });
    return res;
}