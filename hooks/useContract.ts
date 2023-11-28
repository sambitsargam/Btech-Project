import {ethers} from "ethers";
import {abi, CONTRACT_ADDRESS} from "../constants"
import {useAccount, useSigner} from "wagmi";

export const useContract = () => {
    const {data: signer, isError, isLoading} = useSigner()
    const {address} = useAccount()

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer!)

    const createUniversity = async (admins: string[], uri: string) => {
        const tx = await contract.createUniversity(admins, uri)
        return tx.wait()
    }

    const createCourse = async (universityId: number, name: string, admins: string[], uri: string, price: string, streamKey: string, playbackId: string) => {
        const wei = ethers.utils.parseEther(price)
        console.log(wei)
        console.log({universityId, name, admins, uri, wei, streamKey, playbackId})
        const tx = await contract.createCourse(universityId, name, admins, uri, wei, streamKey, playbackId)
        return tx.wait()
    }

    const addAssignment = async (courseId: number, uri: string) => {
        const tx = await contract.addAssignment(courseId, uri)
        return tx.wait()
    }

    const enroll = async (courseId: number, price: string) => {
        const tx = await contract.enroll(courseId, {value: ethers.utils.parseEther(price)})
        return tx.wait()
    }

    const setNftId = async (courseId: number, nftId: string) => {
        const tx = await contract.setNftId(courseId, nftId)
        return tx.wait()
    }

    const addUser = async (accHex: string) => {
        const tx = await contract.addUser(accHex)
        return tx.wait()
    }

    const gradeSubmission = async (courseId: number, assignmentId: number, student: string, grade: number) => {
        const tx = await contract.gradeSubmission(courseId, assignmentId, student, grade)
        return tx.wait()
    }

    const submitAssignment = async (courseId: number, assignmentId: number, uri: string) => {
        const tx = await contract.submitAssignment(courseId, assignmentId, uri)
        return tx.wait()
    }

    const totalAssignments = async () => {
        const total = await contract.getAssignmentCount()
        return total.toNumber()
    }

    const totalCourses = async () => {
        const total = await contract.getCourseCount()
        return total.toNumber()
    }

    const totalUniversities = async () => {
        const total = await contract.getUniversityCount()
        return total.toNumber()
    }

    const getAssignmentIds = async (courseId: number) => {
        return await contract.getAssignmentIds(courseId)
    }

    const getTokenId = async (courseId: number, student: string) => {
        return await contract.getTokenId(courseId, student)
    }

    const getNftId = async (courseId: number, student: string) => {
        return await contract.getNftId(courseId, student)
    }

    const getCourseIds = async (universityId: number) => {
        return await contract.getCourseIds(universityId)
    }

    const getStreamKey = async (courseId: number) => {
        return await contract.getStreamKey(courseId)
    }

    const getPlaybackId = async (courseId: number) => {
        return await contract.getPlaybackId(courseId)
    }

    const getStudentGrade = async (assignmentId: number, student: string) => {
        return await contract.getStudentGrade(assignmentId, student)
    }

    const getStudentGrades = async (courseId: number, assignmentId: number) => {
        return await contract.getStudentGrades(courseId, assignmentId)
    }

    const getStudentSolutions = async (courseId: number, assignmentId: number) => {
        return await contract.getStudentSolutions(courseId, assignmentId)
    }

    const getStudents = async (courseId: number) => {
        return await contract.getStudents(courseId)
    }

    const getUniversity = async (universityId: number) => {
        return await contract.getUniversity(universityId)
    }

    const getCourse = async (courseId: number) => {
        return await contract.getCourse(courseId)
    }

    const getAssignment = async (assignmentId: number) => {
        return await contract.getAssignment(assignmentId)
    }

    const getYourGrade = async (courseId: number, assignmentId: number) => {
        return await contract.getYourGrade(courseId, assignmentId)
    }

    const getYourSolution = async (courseId: number, assignmentId: number) => {
        return await contract.getYourSolution(courseId, assignmentId)
    }

    const isAssignmentInCourse = async (courseId: number, assignmentId: number) => {
        return await contract.isAssignmentInCourse(courseId, assignmentId)
    }

    const isCourseAdmin = async (courseId: number, admin: `0x${string}`) => {
        return await contract.isCourseAdmin(courseId, admin)
    }

    const isEnrolled = async (courseId: number, student: string) => {
        return await contract.isEnrolled(courseId, student)
    }

    const isUniversityAdmin = async (universityId: number, admin: string) => {
        return await contract.isUniAdmin(universityId, admin)
    }

    const getAccountHex = async (address: string) => {
        return await contract.getAccountHex(address)
    }

    return {
        createUniversity,
        createCourse,
        addAssignment,
        enroll,
        setNftId,
        gradeSubmission,
        submitAssignment,
        totalAssignments,
        totalCourses,
        totalUniversities,
        getAssignmentIds,
        getStudentGrade,
        getStudentGrades,
        getStudentSolutions,
        getStudents,
        getUniversity,
        getYourGrade,
        getYourSolution,
        isAssignmentInCourse,
        isCourseAdmin,
        isEnrolled,
        isUniversityAdmin,
        getTokenId,
        getNftId,
        getCourse,
        getAssignment,
        addUser,
        getAccountHex,
        getCourseIds,
        getStreamKey,
        getPlaybackId
    }

}
