import {
    Avatar,
    Table,
    Group,
    Text,
    ActionIcon,
    Menu,
    ScrollArea,
    Paper,
    Title,
} from '@mantine/core';
import {
    IconPencil,
    IconMessages,
    IconNote,
    IconReportAnalytics,
    IconTrash,
    IconDots,
    IconUsers,
} from '@tabler/icons';
import makeBlockie from 'ethereum-blockies-base64';

interface UsersStackProps {
    admins: string[];
}

export function ProffPannel(props: UsersStackProps) {
    // TODO: set data to actual end
    const data = [
        {
            name: 'Dhatri Pandya',
            description:
                'Hey there!I have a lot of experience in management and I think I am the best fit for this position :)',
            address: '0x044B595C9b94A17Adc489bD29696af40ccb3E4d2',
        },
        {
            name: 'Pattric Collins',
            description:
                'Hey! I have done a lot of stuff in digital marketing and I think I am the best fit for this position :)',
            address: '0x9e03C44b5A09db89bf152F8C5500dF3360c1C5bF',
        },
        {
            name: 'Andy Samberg',
            description:
                'Hey! I have done a lot of stuff in digital marketing and I think I am the best fit for this position :)',
            address: '0x9e03C44b5A09db89bf152F8C5500dF3360c1C5bc',
        },
    ];
    let rows
    console.log(props.admins)
    if (props.admins) {
        rows = props.admins.map((item) => (
            <tr key={item}>
                <td>
                    <Group spacing='sm'>
                        <Avatar
                            size={40}
                            src={makeBlockie(item)}
                            radius={40}
                        />
                        <div>
                            <Text size='sm' weight={500}>
                                {item.slice(0, 6) +
                                    '...' +
                                    item.slice(-4)}
                            </Text>
                        </div>
                    </Group>
                </td>
                <td>
                    <Text size='sm'>{item}</Text>
                </td>
            </tr>
        ));
    }

    return (
        <div>
            <Group p='lg'>
                <Text ml={10} mt={32}>
                    <IconUsers size={32}/>
                </Text>
                <Title mt={30}>University Admin</Title>
            </Group>
            <Paper shadow='sm' radius='lg' mt={20} p='lg' withBorder>
                <ScrollArea>
                    <Table sx={{minWidth: 800}} verticalSpacing='md'>
                        <tbody>{rows}</tbody>
                    </Table>
                </ScrollArea>
            </Paper>
        </div>
    );
}
