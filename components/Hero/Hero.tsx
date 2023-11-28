import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons";
import Link from "next/link";
import image from "./image.svg";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.xl * 1,
    paddingBottom: theme.spacing.xl * 1,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  content: {
    maxWidth: 500,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  title: {
    color: "orange",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },

  image: {
    flex: 2,
	width: '100%',
	height: 'auto',

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.primaryColor,
    }).background,
    borderRadius: theme.radius.sm,
    padding: "4px 12px",
  },
}));

export function Hero() {
  const { classes } = useStyles();
  return (
    <div>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>Decentralized University.</Title>
            <Text color="blue" mt="md">
              <b>
                DeUniversity is a decentralized university that allows you to
                create courses, recruit students, conduct live classes, Chat
                with students, Solve Doubts and much more.
              </b>
            </Text>

            <List
              mt={35}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={30} radius="xl">
                  <IconCheck size={12} stroke={4.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Learning made easy</b> – We provide a user-friendly interface
                that allows you to create courses, enroll students, and use the
                content library. All your course materials are stored in the
                decentralized storage so there is no need to worry about hosting
                costs.
              </List.Item>
              <List.Item>
                <b>Doubt Solving</b> – We provide a user-friendly interface that
                allows you to ask questions, Doubt solving in a decentralized
                university may be done in a variety of ways, depending on the
                specific resources and systems that are in place.
              </List.Item>
              <List.Item>
                <b>The future of education</b> – DeUniversity's key features
                include live classes, student-to-student interaction, and
                self-paced learning - giving you the chance to become anything
                you want!
              </List.Item>
            </List>

            <Group mt={30}>
              <Link href="/home">
                <Button radius="xl" size="md" className={classes.control}>
                  Get started
                </Button>
              </Link>
            </Group>
          </div>
          <Image src={image.src} className={classes.image} width="100%" />
        </div>
      </Container>
    </div>
  );
}
