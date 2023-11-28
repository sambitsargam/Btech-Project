import { Layout } from '../components/Layout/Layout';
import { Tabs } from '@mantine/core';
import { IconBook, IconSchool, IconUsers } from '@tabler/icons';
import { UniversityPannel } from '../components/UniversityPannel/UniversityPannel';
import { ProffPannel } from '../components/ProffPannel/ProffPannel';
import { CoursePannel } from '../components/CoursePannel/CoursePannel';
import { Chat } from '@pushprotocol/uiweb';
import {useAccount, useSigner} from 'wagmi';
import {useRouter} from "next/router";
import {useContract} from "../hooks/useContract";
import {useEffect, useState} from "react";

export default function University() {
	const { address } = useAccount();
	const {data: signer} = useSigner()
	const { getUniversity } = useContract()
	const [data, setData] = useState<any>()
	const [admins, setAdmins] = useState<any>(["0x0000000000000000000000000000000000000000"])
	const [universityId, setUniversityId] = useState<number>()
	const [id, setId] = useState<string>("0")
	const router = useRouter()
	useEffect(() => {
		if(!signer) return
		const id = router.query.id
		setId(id as string)
		const getUni = async () => {
			if (typeof id === "string") {
				setUniversityId(parseInt(id))
				const uni = await getUniversity(parseInt(id))
				const data = await fetch(`https://${uni[1]}.ipfs.nftstorage.link`)
				const json = await data.json()
				setData(json)
				setAdmins(uni[0])
			}
		}
		getUni()
	}, [signer, router.query, router.isReady])

	return (
		<div>
			<Layout>
				<Tabs defaultValue='first'>
					<Tabs.List>
						<Tabs.Tab value='first' icon={<IconSchool size={18} />}>
							Home
						</Tabs.Tab>
						<Tabs.Tab value='second' icon={<IconUsers size={18} />}>
							University Admin
						</Tabs.Tab>
						<Tabs.Tab value='third' icon={<IconBook size={18} />}>
							Courses Offered
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value='first'>
						<UniversityPannel
							universityName={data?.name}
							image={`https://${data?.image}.ipfs.nftstorage.link`}
							description={data?.description}
							universityId={universityId!}
						/>
					</Tabs.Panel>

					<Tabs.Panel value='second'>
						<ProffPannel admins={admins} />
					</Tabs.Panel>

					<Tabs.Panel value='third'>
						<CoursePannel id={id} />
					</Tabs.Panel>
				</Tabs>
				<Chat
					// @ts-ignore
					account={address} //user address
					supportAddress="0x46E9492E532567339F1bF2aFd679b21391ae6a0f"
					apiKey='jVPMCRom1B.iDRMswdehJG7NpHDiECIHwYMMv6k2KzkPJscFIDyW8TtSnk4blYnGa8DIkfuacU0'
					env='staging'
				/>
			</Layout> 
		</div>
	);
}
