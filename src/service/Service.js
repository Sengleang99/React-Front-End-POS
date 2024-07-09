import api from "../Utils/api";

export const GET_ALL_PRODUCT = async()=>{
    const response = await api.get("/getallproduct")
    return response.data
}



