import {
	Stepper,
	Title,
	Text,
	TextInput,
	Input,
	Tooltip,
	Select,
	MultiSelect,
	Stack,
	Group,
	Button,
	Textarea,
	List,
	Code,
	NumberInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useListState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import {
	IconAlertCircle,
	IconCurrencyEthereum,
	IconWorldWww,
} from '@tabler/icons';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESS } from '../../constants';
import { useContract } from '../../hooks/useContract';
import useNftStorage from '../../hooks/useNftStorage';
import { AddressInput } from '../AddressInput/AddressInput';
import { ImageInput } from '../ImageInput/ImageInput';
import { MemberList } from '../MemberList/MemberList';
import { NameInput } from '../NameInput/NameInput';
import { schema } from './schema';

export function CreateCourse({universityId}:any) {
	const [loading, setLoading] = useState(false);
	const [active, setActive] = useState(0);
	const [image, setImage] = useState<File>();
	const [members, membersHandlers] = useListState<`0x${string}`>([]);
	const {createCourse} = useContract();
	const {address} = useAccount()
	const {uploadJson, uploadImage} = useNftStorage()
	const router = useRouter()

	const defaultTags = [
		'Blockchain',
		'Airtificial Intelligence',
		'Machine Learning',
		'Data science',
		'Cryptography',
		'Cyber Security',
		'Web Development',
	];

	const form = useForm({
		validate: zodResolver(schema),
		validateInputOnChange: true,
		initialValues: {
			projectName: '',
			displayName: '',
			website: '',
			description: '',
			shortDescription: '',
			tags: [],
			// type: '',
			price: 0,
		},
	});

	const removeMember = (member: `0x${string}`) => {
		membersHandlers.filter(
			(other: string) => other.toLowerCase() !== member.toLowerCase()
		);
	};

	const addMember = (member: `0x${string}`) => {
		removeMember(member);
		membersHandlers.append(member);
	};

	const nextStep = () =>
		setActive((current) => {
			// if (form.validate().hasErrors) {
			// 	return current;
			// }
			return current < 3 ? current + 1 : current;
		});

	const prevStep = () =>
		setActive((current) => (current > 0 ? current - 1 : current));

	const handleSubmit = async () => {
		setLoading(true)
		showNotification({
			title: 'Creating Course',
			message: 'Please wait while we create your course',
		})
		const finMembers = [...members, address!, CONTRACT_ADDRESS]
		addMember(address!);
		addMember(CONTRACT_ADDRESS)
		try {
			const response = await fetch(`https://livepeer.studio/api/stream`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_STUDIO_API_KEY}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: form.values.projectName
				})
			});
			
			const data = await response.json()
			console.log("data", data)
			const playbackId = data.playbackId
			const streamKey = data.streamKey
			const imageCid = await uploadImage(image!)
			const fileId = await uploadJson({
				name: form.values.displayName,
				shortDescription: form.values.shortDescription,
				description: form.values.description,
				image: imageCid,
				tags: form.values.tags,
				price: form.values.price.toString()
			})
			console.log(fileId)
			const id = router.query.id
			if (typeof id === "string") {
				const res = await createCourse(parseInt(id), form.values.projectName, finMembers, fileId, form.values.price.toString(), streamKey, playbackId);
				
				console.log(res)
				showNotification({
					title: 'Course Created',
					message: 'Your course has been created',
				})
				setLoading(false)
				router.push("/university?id="+id)
				console.log('submit');
			}else{
				console.log("university id is not passed in query params")
				showNotification({
					title: 'Error',
					message: 'There was an error creating your course',
				})
				setLoading(false)
			}
		} catch (error) {
			console.log(error);
			showNotification({
				title: 'Error',
				message: 'There was an error creating your course',
			})
			setLoading(false)
		}
	};

	return (
		<>
			<Stepper active={active} breakpoint='sm' style={{ marginTop: 75 }}>
				<Stepper.Step my={'sm'} label='Basic Info'>
					<Title mt='lg'>Basic Info</Title>
					<Text color='dimmed'>This is your public course info.</Text>
					<Title my={'sm'} order={4}>
						Course Image
					</Title>
					<ImageInput
						width={600}
						height={300}
						onChange={setImage}
						value={image}
					/>
					<Title my={'sm'} order={4}>
						Course Name (cannot be changed){' '}
						<span style={{ color: 'red' }}>*</span>
					</Title>
					<NameInput
						parentId={"duni"}
						required
						placeholder='Unique Account Name'
						{...form.getInputProps('projectName')}
					/>
					<Title my={'sm'} order={4}>
						Display Name <span style={{ color: 'red' }}>*</span>
					</Title>
					<TextInput
						placeholder='Display Name'
						{...form.getInputProps('displayName')}
					/>
					<Title my={'sm'} order={4}>
						Website
					</Title>
					<Input
						icon={<IconWorldWww size={16} />}
						my={'sm'}
						placeholder='Your Website'
						{...form.getInputProps('website')}
						rightSection={
							<Tooltip
								label='This is public'
								position='top-end'
								withArrow
							>
								<div>
									<IconAlertCircle
										size={18}
										style={{
											display: 'block',
											opacity: 0.5,
										}}
									/>
								</div>
							</Tooltip>
						}
					/>
					<Title my={'sm'} order={4}>
						Price
					</Title>
					<NumberInput
						defaultValue={0.05}
						precision={2}
						min={0}
						step={0.01}
						// max={}
						icon={<IconCurrencyEthereum />}
						{...form.getInputProps('price')}
					/>

					<Title my={'sm'} order={4}>
						Tags
					</Title>
					<MultiSelect
						data={defaultTags}
						placeholder='Select tags'
						searchable
						creatable
						getCreateLabel={(query) => `+ Create ${query}`}
						{...form.getInputProps('tags')}
					/>
				</Stepper.Step>

				<Stepper.Step my={'sm'} label='Description'>
					<Stack style={{ maxWidth: 784 }}>
						<Title mt='lg'>Description</Title>
						<Text color='dimmed'>
							Let everyone know about your project.
						</Text>
						<Title order={2}>Short Description</Title>
						<Text color='dimmed'>
							Enter a brief summary of the project. This will be
							displayed on the project card or thumbnail.
						</Text>
						<TextInput
							label='Short Description'
							{...form.getInputProps('shortDescription')}
						/>
						<Title order={2}>Description</Title>
						<Text color='dimmed'>
							Give an extensive overview of your project. This
							will be displayed on your project landing page.
						</Text>
						<Textarea
							label='Description'
							autosize={true}
							minRows={4}
							maxRows={12}
							{...form.getInputProps('description')}
						/>
					</Stack>
				</Stepper.Step>

				<Stepper.Step label='Members'>
					<Stack style={{ maxWidth: 784 }}>
						<Title mt='lg'>Members</Title>
						<Text color={'dimmed'}>
							Members can perform the following actions:
						</Text>
						<List>
							<List.Item>Update course info</List.Item>
							<List.Item>Add or remove course members</List.Item>
							<List.Item>Publish new releases</List.Item>
						</List>
						<Title order={2}>Project Member</Title>
						<AddressInput onSubmit={addMember} />
						<MemberList
							label='Project Member'
							members={members}
							editable={true}
							onRemove={removeMember}
						/>
					</Stack>
				</Stepper.Step>

				<Stepper.Completed>
					Completed! Form values:
					<Code block mt='xl'>
						{JSON.stringify(form.values, null, 2)}
						{JSON.stringify(members, null, 2)}
					</Code>
				</Stepper.Completed>
			</Stepper>

			<Group position='right' mt='xl'>
				{active !== 0 && (
					<Button disabled={loading} variant='default' onClick={prevStep}>
						Back
					</Button>
				)}
				{active !== 3 && <Button disabled={loading} onClick={nextStep}>Next step</Button>}
				{active === 3 && (
					<Button disabled={loading} onClick={() => handleSubmit()}>Confirm</Button>
				)}
			</Group>
		</>
	);
}
