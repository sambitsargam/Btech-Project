import {
  Center,
  Title,
  Paper,
  Text,
  Image,
  Group,
  Button,
} from "@mantine/core";

interface UniversityPannelProps {
  universityName: string;
  image: string;
  description: string;
  universityId: number;
}
import {
  Container,
  Grid,
  SimpleGrid,
  Skeleton,
  useMantineTheme,
} from "@mantine/core";
import { IconBook2, IconSchool } from "@tabler/icons";
import Link from "next/link";

const PRIMARY_COL_HEIGHT = 300;

export function UniversityPannel({
  universityName,
  image,
  description,
  universityId,
}: UniversityPannelProps) {
  const theme = useMantineTheme();
  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;
  return (
    <div>
      <Paper shadow="sm" radius="lg" mt={20} p="md" withBorder>
        <SimpleGrid
          cols={2}
          spacing="md"
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        >
          <Grid gutter="md">
            <Grid.Col>
              <Group>
                <Text ml={10} mt={32}>
                  <IconSchool size={42} />
                </Text>
                <Title mt={30}>{universityName}</Title>
              </Group>
            </Grid.Col>
            <Grid.Col>
              <Text align="justify" fz="lg" px={20}>
                {description}
              </Text>
            </Grid.Col>
          </Grid>

          <Grid gutter="md" mt={0} mx={20} justify="flex-end">
            <Link href={"/create-course?id=" + universityId}>
              <Button
                variant="outline"
                color="indigo"
                radius="lg"
                size="md"
                mt={20}
                leftIcon={<IconBook2 />}
              >
                Create Course
              </Button>
            </Link>

            <Image
              height={360}
              mt={20}
              radius="md"
			  fit="contain"
              // src='https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80'
              src={image}
            />
          </Grid>
        </SimpleGrid>
      </Paper>
    </div>
  );
}
