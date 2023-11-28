import { Player } from '@livepeer/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useContract } from '../../hooks/useContract';

export function LiveClassesPannel() {
	const [playbackId, setPlaybackId] = useState('');
	const {getPlaybackId} = useContract()
	const router = useRouter()

	useEffect(() => {
		(async() => {
			const id = router.query.id
			if (typeof id === "string") {
				const pId = await getPlaybackId(parseInt(id))
				 setPlaybackId(pId)
				//setPlaybackId("177cwx8nxx5ourku")
			}
		})()
	}, [router.query]);
	return (
		<>
			<Player title='LiveClass' playbackId={playbackId} autoPlay muted />
		</>
	);
}
