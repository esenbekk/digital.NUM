import { Dots } from "$/components/dots";
import { createStyles, Title, SimpleGrid, Text, Button, ThemeIcon, Grid, Col, Space } from "@mantine/core";
import Link from "next/link";
import { FC } from "react";
import { Calendar, School } from "tabler-icons-react";
import { Footer } from "$/components/footer";

const useStyles = createStyles((theme) => ({
	wrapper: {
		minHeight: "100vh",
		position: "relative",
		paddingTop: 120,
		paddingBottom: 80,
		paddingLeft: 80,
		paddingRight: 80,

		"@media (max-width: 755px)": {
			paddingTop: 80,
			paddingBottom: 60,
			paddingLeft: 40,
			paddingRight: 40,
		},
	},

	title: {
		fontSize: 42,
		fontWeight: 900,
		lineHeight: 1.1,
		marginBottom: theme.spacing.md,
		color: theme.colorScheme === "dark" ? theme.white : theme.black,
	},
	dots: {
		position: "absolute",
		color: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1],
		zIndex: -1,

		"@media (max-width: 755px)": {
			display: "none",
		},
	},

	dotsLeft: {
		left: 0,
		top: 0,
	},
}));

const features = [
	{
		icon: <Calendar size={26} />,
		title: "Хоосон анги ологч",
		description: "Хүссэн цагтаа хичээл хийж болох хоосон ангиа олоорой",
	},
	{
		icon: <School size={26} />,
		title: "Хичээлийн хуваарь төлөвлөгч",
		description: "Байж болох хамгийн сайн хуваарийг төлөвлөөрэй",
	},
];

const Home: FC = () => {
	const { classes } = useStyles();

	const items = features.map((feature) => (
		<div key={feature.title}>
			<ThemeIcon size={44} radius="md">
				{feature.icon}
			</ThemeIcon>
			<Text size="lg" mt="sm" weight={500}>
				{feature.title}
			</Text>
			<Text color="dimmed" size="sm">
				{feature.description}
			</Text>
		</div>
	));

	return (
		<div className={classes.wrapper}>
			<Dots className={classes.dots} style={{ left: 0, top: 0 }} />
			<Dots className={classes.dots} style={{ left: 60, top: 0 }} />
			<Dots className={classes.dots} style={{ left: 0, top: 140 }} />
			<Dots className={classes.dots} style={{ right: 0, top: 60 }} />
			<Grid
				gutter={80}
				style={{
					height: "100%",
					minHeight: "60vh",
				}}
			>
				<Col span={12} md={5}>
					<Title className={classes.title} order={1}>
						МУИС-ын оюутны туслах систем
					</Title>
					<Text color="dimmed">Оюутан та амьдралаа технолоноор дамжуулан хөнгөвчлөөрөй!</Text>
					<Link href="/dashboard" passHref>
						<Button size="lg" radius="md" mt="xl">
							Эхлэх
						</Button>
					</Link>
				</Col>
				<Col span={12} md={7}>
					<SimpleGrid cols={1} spacing={30} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
						{items}
					</SimpleGrid>
				</Col>
			</Grid>
			{/* <Footer /> */}
		</div>
	);
};

export default Home;
