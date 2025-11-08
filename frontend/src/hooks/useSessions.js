import {useMutation ,useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { sessionApi } from "../api/sessions.js"

export const useCreateSession = () => {
    const respone = useMutation({
        mutationKey:["createSession"],
        mutationFn:() => sessionApi.createSession,
        onSuccess:()=>toast.success("session created successfully"),
        onError: (error)=> toast.error(error.respone.data.message || "failed to create room")
    })

    return respone
};

export const useActiveSessions = () => {
    const respone = useQuery({
        queryKey:["getActiveSessions"],
        queryFn:() => sessionApi.getActiveSessions 
    })

    return respone
};

export const useMyRecentSessions = () => {
    const respone = useQuery({
        queryKey:["getMyRecentSessions"],
        queryFn:() => sessionApi.getMyRecentSessions
    })

    return respone
};

export const useSessionById = (id) => {
    const respone = useQuery({
        queryKey:["sessionById",id],
        queryFn:() => sessionApi.getSessionById(id),
        enabled:!!id,
        refetchInterval:5000
    })

    return respone
};

export const useJoinSession = (id) => {
    return  useMutation({
        mutationKey:["joinSession",id],
        mutationFn:() => sessionApi.joinSession(id),
        onSuccess:()=>toast.success("joined session successfully"),
        onError: (error)=> toast.error(error.respone.data.message || "failed to join room")
    })
};

export const useEndSession = (id) => {
    return  useMutation({
        mutationKey:["EndSession",id],
        mutationFn:() => sessionApi.endSession(id),
        onSuccess:()=>toast.success("ession ended successfully"),
        onError: (error)=> toast.error(error.respone.data.message || "failed to end room")
    })
};