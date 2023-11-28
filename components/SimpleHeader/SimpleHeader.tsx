import { createStyles, Button, Group, Header, Title , Menu} from '@mantine/core';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ReactNode, useEffect, useState } from "react";
import Link from 'next/link';
import { ActionToggle } from '../ActionToggle/ActionToggle';
import usePush from "../../hooks/usePush";
import { useAccount } from 'wagmi';
import { chainNameType, NotificationItem } from "@pushprotocol/uiweb";

const useStyles = createStyles((theme) => ({
	title: {
		cursor: 'pointer',
		[theme.fn.smallerThan('md')]: {
			fontSize: theme.fontSizes.xl,
		},
	},

	headBackColor: {
		backgroundColor: '#003049',
	},
}));

export function SimpleHeader() {
	const { classes, theme } = useStyles();
	const { address, isConnected } = useAccount()
	const { receiveNotifs, hasUserOptedIn, optIn } = usePush();
	const getNotifs = async () => {
        return await receiveNotifs(address)
    };
	
    const [notifications, setNotifications] = useState([]);
    const [userSubscriptions, setUserSubscriptions] = useState<Array<{ channel: string }>>([]);
	
    const notif = (
        <div>
            {notifications &&
                notifications.map((oneNotification, i) => {
                    const { cta, title, message, app, icon, image, url, blockchain, notification } =
                        oneNotification

                    return (
                        <NotificationItem
                            key={crypto.randomUUID()} // any unique id
                            notificationTitle={title}
                            notificationBody={message}
                            cta={cta}
                            app={app}
                            icon={icon}
                            image={image}
                            url={url}
                            theme={"dark"}
                            chainName={blockchain as chainNameType} // if using Typescript
                        />
                    )
                })}
        </div>
    );


    useEffect(() => {
        if (!address) {
            return
        }
        getNotifs().then((res) => {
            setNotifications(res)
        })
        hasUserOptedIn(address).then((res) => {
            setUserSubscriptions(res)
            console.log("userSubscriptions", { res })
        })
    }, [address]);
	const hasUserOptedInToChannel = userSubscriptions.some(
        (subscription) => subscription.channel === "0x490cf4c9ad7827d5dc09bf07ace6c694e258c89a"
    );

	return (
		<Header
			height={100}
			p='md'
			className={classes.headBackColor}
			sx={{ borderWidth: 0 }}
		>
			<Group position='apart' p={'md'} sx={{ height: '100%' }}>
				<Group>
					<Link href={'/'}>
						<Title
							order={1}
							className={classes.title}
							color='white'
						>
							DeUniversity
						</Title>
					</Link>
				</Group>
				<Group>
				<div>
                            {!hasUserOptedInToChannel ? (
                                <Button
                                    onClick={() => {
                                        optIn()
                                    }}
                                >
                                    Opt In the University Notifications
                                </Button>
                            ) : (
                                <Menu>
                                    <Menu.Target>
                                        <Button>Notifications</Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item>{notif}</Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            )}
                        </div>
				</Group>
				<Group>
					<ConnectButton
						accountStatus={{
							smallScreen: 'avatar',
							largeScreen: 'full',
						}}
						showBalance={false}
					/>
					<ActionToggle />
				</Group>
			</Group>
		</Header>
	);
}