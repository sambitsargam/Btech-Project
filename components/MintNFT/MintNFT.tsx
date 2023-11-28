import {
	Card,
	Image,
	Text,
	Group,
	Badge,
	createStyles,
	Center,
	Button,
	Title,
} from '@mantine/core';
import {
	IconBooks,
	IconFileCertificate,
	IconGasStation,
	IconGauge,
	IconManualGearbox,
	IconUsers,
} from '@tabler/icons';
import Link from 'next/link';
import {useContract} from "../../hooks/useContract";
import {useEffect, useState} from "react";
// return functional component with button that mints nft
// Remove the duplicate import statement for Button
// import { Button } from '@chakra-ui/react';

// Keep the existing import statement for Button from '@mantine/core'
// Remove the duplicate import statement for Button
// import { Button } from '@mantine/core';
import { useAccount } from 'wagmi'
import axios from 'axios'

export default function MintButton(props) {
	const { address, isConnecting, isDisconnected } = useAccount()
	//if (isConnecting) return <div>Connecting…</div>
	//if (isDisconnected) return <div>Disconnected</div>

	useEffect(() => {
		async function fetchData() {
			const options = {
				method: 'POST',
				url: 'https://api.nftport.xyz/v0/metadata',
				headers: { 'Content-Type': 'application/json', Authorization: process.env.NEXT_PUBLIC_NFTPORT_API_KEY },
				data: {
					name: props.caseObj.name,
					description: props.caseObj.description,
					file_url: 'https://www.programmableweb.com/sites/default/files/styles/article_profile_150x150/public/nftport-logo.jpg',
					custom_fields: {
						card: props.caseObj.report,
						grade1: props.caseObj.grade1,
						grade2: props.caseObj.grade2,
					},
				},
			}
			console.log('options', options)
			const response = await axios.request(options)
			console.log('response', response)
			const options2 = {
				method: 'POST',
				url: 'https://api.nftport.xyz/v0/mints/customizable',
				headers: {
					'Content-Type': 'application/json',
					Authorization: process.env.NEXT_PUBLIC_NFTPORT_API_KEY,
				},
				data: {
					chain: 'polygonMumbai',
					contract_address: process.env.NEXT_PUBLIC_NFTPORT_CONTRACT_ADDRESS,
					metadata_uri: response.data.metadata_uri,
					mint_to_address: props.caseObj.card,
				},
			}
			const response2 = await axios.request(options2)
			console.log('options2', options2)
			console.log('response2', response2)
		}
		fetchData()
	}, [])
	return <Button onClick={() => console.log('mint nft', JSON.stringify(props.caseObj))}>Mint NFT</Button>
}