import {
	Group,
	Title,
	Text,
	Accordion,
	Avatar,
	Paper,
	ScrollArea,
	Table,
	useMantineTheme,
	Modal,
	NumberInput,
} from '@mantine/core';
import { IconPencil, IconPlus, IconTarget } from '@tabler/icons';
import makeBlockie from 'ethereum-blockies-base64';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container } from 'tabler-icons-react';
import { useSigner } from 'wagmi';
import { useContract } from '../../hooks/useContract';
import { Button } from '../Button/Button';
import { Revise } from "revise-sdk";


export function SubmissionPannel() {
	const {data: signer} = useSigner()
	const router = useRouter()
	const [assignGradeopened, setAssignGradeOpened] = useState(false);
	const [value, setValue] = useState(0);
	const theme = useMantineTheme();
	const {getAssignmentIds, getAssignment, getStudents, getStudentGrades, gradeSubmission, getNftId} = useContract()

	const [data, setData] = useState<any>([])
	const [assignId, setAssignId] = useState<any>()
	const [assignTitle, setAssignTitle] = useState<any>()
	const [student, setStudent] = useState<any>()

	useEffect(() => {
		if (router.query.id && signer) {
			// fetchAssignments()
			fetchStudents()
		}
	}, [router.query.id, signer])

	const fetchStudents = async () => {
		console.log("fetching students")
		const id = router.query.id
		if (typeof id === "string") {
			const students = await getStudents(parseInt(id))
			fetchAssignments(students)
		}
	}

	const fetchAssignments = async (students: [string]) => {
		const cId = router.query.id
		if (typeof cId === "string") {
			const ids = await getAssignmentIds(parseInt(cId))
			const data = await Promise.all(ids.map(async (id: any) => {
				const res = await getAssignment(parseInt(id))
				const data = await fetch(`https://${res}.ipfs.nftstorage.link`)
				const json = await data.json()
				const title = json.name
				const result = await getStudentGrades(parseInt(cId), parseInt(id))
				const marks = result.length > 0 ? result[0].map((student: string, index: number) => {
					return {
						address: student,
						grade: (result[1][index]).toString()
					}
				}) : []
				return {
					id,
					title,
					marks
				}
			}))
			console.log("data", data)
			setData(data)
		}
	}

	// const data = [
	// 	{
	// 		title: 'PDS Assignment',
	// 		marks: [
	// 			{
	// 				address: '0x044B595C9b94A17Adc489bD29696af40ccb3E4d2',
	// 				grade: '78',
	// 			},
	// 			{
	// 				address: '0x044B595C9b94A17Adc489bD29696af40ccb3E4d1',
	// 				grade: '85',
	// 			},
	// 			{
	// 				address: '0x044B595C9b94A17Adc489bD29696af40ccb3E4d3',
	// 				grade: '61',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		title: 'ADA Assignment',
	// 		marks: [
	// 			{
	// 				address: '0x044B595C9b94A17Adc489bD29696af40ccb3E4d2',
	// 				grade: '78',
	// 			},
	// 			{
	// 				address: '0x044B595C9b94A17Adc489bD29696af40ccb3E4d1',
	// 				grade: '85',
	// 			},
	// 			{
	// 				address: '0x044B595C9b94A17Adc489bD29696af40ccb3E4d3',
	// 				grade: '61',
	// 			},
	// 		],
	// 	},
	// ];

	const assignGrade = async(value: number) => {
		const id = router.query.id
		console.log("assigning grade", value, assignId.toString(), student, id)
		const revise = new Revise({auth: process.env.NEXT_PUBLIC_REVISE_AUTH_TOKEN!});
		// @ts-ignore
		const nftId = await getNftId(parseInt(id), student)
		console.log("nftId", nftId)
		const nft = await revise.fetchNFT(nftId);
		console.log("nft", nft)
		const result = await revise.nft(nft)
							.setProperty("marks", value)
							.save();
		console.log("result", result)
		// @ts-ignore
		const res = await gradeSubmission(parseInt(id), parseInt(assignId.toString()), student,value)
		// console.log("res", res)
	}

	const assignments = data.map((item:any) => (
		<>
			<Accordion.Item value={item.title}>
				<Accordion.Control>
					<Title order={4}>{item.title}</Title>
				</Accordion.Control>
				<Accordion.Panel>
					{item.marks.map((mark:any, index: number) => (
						<>
							<Paper
							key={index}
								shadow='sm'
								radius='lg'
								mt={20}
								p='lg'
								withBorder
							>
								<ScrollArea>
									<Table
										sx={{ minWidth: 800 }}
										verticalSpacing='md'
									>
										<tbody>
											<tr>
												<th>
													<Text align='left'>
														Student Address
													</Text>
												</th>
												<th>
													<Text align='left'></Text>
												</th>
												<th>
													<Text align='left'></Text>
												</th>
												<th>
													<Text align='left'>
														Grade
													</Text>
												</th>
											</tr>
											<tr key={mark.address}>
												<td>
													<Group spacing='sm'>
														<Avatar
															size={40}
															src={makeBlockie(
																mark.address
															)}
															radius={40}
														/>
														<div>
															<Text
																size='md'
																weight={500}
															>
																{mark.address}
															</Text>
														</div>
													</Group>
												</td>
												<td>
													<Button>
														View Submission
													</Button>
												</td>
												<td>
													<Button onClick={()=>{
														setAssignId(item.id)
														setStudent(mark.address)
														setAssignTitle(item.title)
														setAssignGradeOpened(true)
													}}>
														Assign Grades
													</Button>
												</td>
												<td>
													<Text size='md'>
														{mark.grade == 0 ? 'Not Graded' : mark.grade}
													</Text>
												</td>
											</tr>
										</tbody>
									</Table>
								</ScrollArea>
							</Paper>
						</>
					))}
				</Accordion.Panel>
			</Accordion.Item>
		</>
	));

	return (
		<>
			<Group p='lg'>
				<Text ml={10} mt={32}>
					<IconTarget size={32} />
				</Text>
				<Title mt={30}>Assignment</Title>
			</Group>

			<Accordion
				chevron={<IconPlus size={16} />}
				transitionDuration={1000}
				styles={{
					chevron: {
						'&[data-rotate]': {
							transform: 'rotate(45deg)',
						},
					},
				}}
			>
				{assignments}
			</Accordion>

			
			<Modal
				opened={assignGradeopened}
				onClose={() => setAssignGradeOpened(false)}
				overlayColor={
					theme.colorScheme === 'dark'
						? theme.colors.dark[9]
						: theme.colors.gray[2]
				}
				overlayOpacity={0.55}
				overlayBlur={3}
				centered
			>
				<NumberInput value={value} onChange={(val: number) => setValue(val)} />
				<Button onClick={()=>{
					assignGrade(value)
				}}>Submit</Button>

			</Modal>
		</>
	);
}
