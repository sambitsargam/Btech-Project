import { Tabs } from '@mantine/core';
import {
	IconSchool,
	IconUsers,
	IconBook,
	IconPencil,
	IconDeviceTv,
	IconPaperclip,
	IconTarget,
} from '@tabler/icons';
import { AssignmentPannel } from '../components/AssignmentPannel/AssignmentPannel';
import { CourseInfoPannel } from '../components/CourseInfoPannel/CourseInfoPannel';
import { CreateAssignment } from '../components/CreateAssignment/CreateAssignment';
import { Layout } from '../components/Layout/Layout';
import { LiveClassesPannel } from '../components/LiveClassesPannel/LiveClassesPannel';
import { ProffPannel } from '../components/ProffPannel/ProffPannel';
import { SubmissionPannel } from '../components/SubmissionPannel/SubmissionPannel';
import {useRouter} from "next/router";
import {useAccount} from "wagmi";
import {useEffect, useState} from "react";
import {useContract} from "../hooks/useContract";

export default function Home() {
	const router = useRouter()
	const {address, status} = useAccount()
	const {getStudents, isCourseAdmin, getCourse} = useContract()
	const [data, setData] = useState<any>()
	const [isTeacher, setIsTeacher] = useState<boolean>(false)
	const [admins, setAdmins] = useState<any>(["0x0000000000000000000000000000000000000000"])
	useEffect(() => {
		if(router.query.id === undefined) return
		const id = router.query.id
		console.log("id", id)
		const getStuds = async () => {
			const isProf = await isCourseAdmin(parseInt(id as string), address!)
			if(isProf) {
				setIsTeacher(true)
				return
			}
			const studs = await getStudents(parseInt(id as string))
			if(!studs.includes(address)) {
				alert("You are not enrolled in this course")
				router.push("/home")
			}
		}
		getStuds()
		const getCourseData = async () => {
			const course = await getCourse(parseInt(id as string))
			setAdmins(course[0])
			const data = await fetch(`https://${course[1]}.ipfs.nftstorage.link`)
			const json = await data.json()
			setData(json)
		}
		getCourseData()
	}, [router.isReady, router.query,status])
	return (
		<>
			<Layout>
				<Tabs defaultValue='first'>
					<Tabs.List>
						<Tabs.Tab value='first' icon={<IconSchool size={18} />}>
							Home
						</Tabs.Tab>
						<Tabs.Tab value='second' icon={<IconUsers size={18} />}>
							Teachers
						</Tabs.Tab>
						<Tabs.Tab value='third' icon={<IconPencil size={18} />}>
							Assignments
						</Tabs.Tab>
						{isTeacher && <Tabs.Tab
							value='fourth'
							icon={<IconPaperclip size={18}/>}
						>
							Create Assignment
						</Tabs.Tab>}
						<Tabs.Tab value='fifth' icon={<IconTarget size={18} />}>
							View Submission
						</Tabs.Tab>
						<Tabs.Tab
							value='sixth'
							icon={<IconDeviceTv size={18} />}
							ml='auto'
						>
							Live Classes
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value='first'>
						<CourseInfoPannel
							isTeacher={isTeacher}
							courseName={data?.name}
							image={`https://${data?.image}.ipfs.nftstorage.link`}
							description={data?.description}
						/>
					</Tabs.Panel>

					<Tabs.Panel value='second'>
						<ProffPannel admins={admins} />
					</Tabs.Panel>

					<Tabs.Panel value='third'>
						<AssignmentPannel />
					</Tabs.Panel>

					<Tabs.Panel value='fourth'>
						<CreateAssignment />
					</Tabs.Panel>

					<Tabs.Panel value='fifth'>
						<SubmissionPannel />
					</Tabs.Panel>

					<Tabs.Panel value='sixth'>
						<LiveClassesPannel />
					</Tabs.Panel>
				</Tabs>
			</Layout>
		</>
	);
}
