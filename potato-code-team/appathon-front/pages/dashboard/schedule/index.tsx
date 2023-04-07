import TimeLine from "$/components/schedule/time_line";
import UnitSelector from "$/components/schedule/unit_selector";
import { GenerateSchedule } from "$/services";
import { Course } from "$/services/types";
import { saveScreenshot } from "$/utils/save_shot";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  Box,
  Button,
  CloseButton,
  Divider,
  Flex,
  MultiSelect,
  Overlay,
  Pagination,
  Paper,
  Select,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import type { NextPage } from "next";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "react-query";
import { Download, FileDownload, Flame } from "tabler-icons-react";

const Home: NextPage = () => {
  const smalScreen = useMediaQuery("(max-width: 600px)");
  const theme = useMantineTheme();
  const [selectedCourses, setSelectedCourses] = useLocalStorage<Course[]>({
    key: "selectedCourses",
    defaultValue: [],
  });
  const [firstTimeVisitor, setFirstTimeVisitor] = useLocalStorage<boolean>({
    key: "firstTimeVisitor",
    // defaultValue: true,
  });

  useEffect(() => {
    if (localStorage.getItem("firstTimeVisitor") === null) {
      setFirstTimeVisitor(true);
    }
  }, [setFirstTimeVisitor]);

  const scheduleRef = useRef<HTMLDivElement>(null);

  const [neverPressedGenerate, setNeverPressedGenerate] =
    useLocalStorage<boolean>({
      key: "firstTimeVisitor",
      defaultValue: true,
    });
  const [clickme, setClickme] = useState(false);
  const [parent] = useAutoAnimate();
  const [option, setOption] = useState<number>(1);
  const getGeneratedSchedule = useMutation(
    (selectedCourses: Course[]) =>
      GenerateSchedule({
        body: selectedCourses.map((course) => course.courseid),
      }),
    {}
  );

  useEffect(() => {
    setClickme(true);
  }, [selectedCourses]);

  const [filter, setFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<string | undefined>(undefined);
  const [selectedTeachers, setSelectedTeachers] = useState<any[]>([]);
  const [selectedDays, setSelectedDays] = useState<any[]>([]);

  function countEmptyArrays(subArr: any[]) {
    return subArr.filter((arr) => arr.length === 0).length;
  }

  const generateCourses = useCallback(() => {
    const filterObj = {
      includesNo740: filter.includes("no_7_40"),
      includesShahsan: sort === "shahsan",
      selectedTeachers: selectedTeachers,
      selectedDays: selectedDays,
    };
    let scheduleData = getGeneratedSchedule.data || [];

    if (filterObj.includesNo740) {
      scheduleData = scheduleData.filter(
        (subArr: any[]) => !subArr.flat().some((obj) => obj.timeid === 1)
      );
    }

    if (filterObj.selectedTeachers.length > 0) {
      scheduleData = scheduleData.filter((subArr: any[]) =>
        filterObj.selectedTeachers.every((teacher) =>
          subArr.flat().some((obj) => obj.empName === teacher)
        )
      );
    }

    if (filterObj.selectedDays.length > 0) {
      scheduleData = scheduleData.filter(
        (subArr: any[]) =>
          !filterObj.selectedDays.some((day) =>
            subArr.flat().some((obj) => obj.weekname === day)
          )
      );
    }

    if (filterObj.includesShahsan) {
      scheduleData = scheduleData.sort(
        (a: any[], b: any[]) => countEmptyArrays(b) - countEmptyArrays(a)
      );
    }

    return scheduleData;
  }, [filter, getGeneratedSchedule.data, selectedDays, selectedTeachers, sort]);

  const courses = useMemo(() => {
    return generateCourses();
  }, [generateCourses]);

  const teachers = useMemo(() => {
    const ts =
      ([] as any[]).concat(...(getGeneratedSchedule.data || [])).flat() || [];
    const uniqueTeachers = ts?.reduce((acc: any[], current: any) => {
      const x = acc.find((item: any) => item.empName === current.empName);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    return uniqueTeachers;
  }, [getGeneratedSchedule.data]);

  const days = useMemo(() => {
    const ts =
      ([] as any[]).concat(...(getGeneratedSchedule.data || [])).flat() || [];
    const uniqueTeachers = ts?.reduce((acc: any[], current: any) => {
      const x = acc.find((item: any) => item.weekname === current.weekname);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    return uniqueTeachers;
  }, [getGeneratedSchedule.data]);

  const handleDownload = () => {
    saveScreenshot(scheduleRef);
  };

  return (
    <Stack
      style={
        {
          // position: "relative",
        }
      }
    >
      {firstTimeVisitor && !getGeneratedSchedule.isLoading && (
        <Overlay color="#000" opacity={0.85} />
      )}
      <Paper
        p={"md"}
        style={{
          border: firstTimeVisitor ? "2px solid green" : "none",
          position: firstTimeVisitor ? "absolute" : "static",
          top: 20,
          right: 20,
          width: firstTimeVisitor ? "80%" : "100%",
          zIndex: firstTimeVisitor ? 99999999999999 : 1,
        }}
      >
        <UnitSelector
          firstTimeVisitor={firstTimeVisitor}
          setSelectedCourses={setSelectedCourses}
          selectedCourses={selectedCourses}
          setFirstTimeVisitor={setFirstTimeVisitor}
        />
      </Paper>
      <Paper>
        <Flex
          p="md"
          ref={parent}
          gap={16}
          style={{
            flexWrap: "wrap",
          }}
        >
          {selectedCourses.map((course) => (
            <Box
              key={course?.courseid}
              style={{
                borderRadius: "5px",
                padding: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
                fontWeight: 600,
                gap: 8,
                backgroundColor: theme.colors.gray[1],
                border: `1px solid ${theme.colors.gray[2]}`,
                color: theme.colors.gray[7],
              }}
            >
              <Stack spacing={0}>
                <Text>{course?.coursename}</Text>
                <Text>{course?.courseindex}</Text>
              </Stack>
              <CloseButton
                onClick={() => {
                  setSelectedCourses(
                    selectedCourses.filter(
                      (selectedCourse) =>
                        selectedCourse.courseid !== course.courseid
                    )
                  );
                }}
              />
            </Box>
          ))}
        </Flex>

        <Box
          m="md"
          p="md"
          style={{
            borderRadius: "5px",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Flex
            style={{
              justifyContent: "space-between",
              alignItems: "start",
            }}
            gap={16}
            direction={smalScreen ? "column" : "row"}
          >
            <Button
              variant="gradient"
              onClick={() => {
                getGeneratedSchedule.mutate(selectedCourses);
                setNeverPressedGenerate(false);
              }}
              loading={getGeneratedSchedule.isLoading}
              disabled={selectedCourses.length === 0}
              style={{
                border: neverPressedGenerate ? "2px solid green" : "none",
              }}
              rightIcon={<Flame />}
            >
              Тооцолох
            </Button>
            <Pagination
              // value={option}
              page={option}
              onChange={setOption}
              total={courses?.length}
            />
          </Flex>
          <Divider my={16} />
          <Flex
            pb="sm"
            gap={8}
            direction={smalScreen ? "column" : "row"}
            align={"end"}
            w={"100%"}
          >
            <MultiSelect
              style={{
                width: smalScreen ? "100%" : "auto",
              }}
              label="Filter"
              data={[{ label: "No 7:40", value: "no_7_40" }]}
              value={filter}
              onChange={(e) => {
                if (e) setFilter(e);
                setOption(1);
              }}
              disabled={!getGeneratedSchedule.data}
            />
            <Select
              style={{
                width: smalScreen ? "100%" : "auto",
              }}
              label="Sort"
              data={[{ label: "Хамгийн шахсан", value: "shahsan" }]}
              value={sort}
              onChange={(e) => {
                if (e) setSort(e);
                setOption(1);
              }}
              disabled={!getGeneratedSchedule.data}
            />
            <MultiSelect
              style={{
                width: smalScreen ? "100%" : "auto",
              }}
              label="Заавал үлдээх багш"
              data={teachers?.map((teacher) => {
                return {
                  label: teacher?.empName,
                  value: teacher?.empName,
                };
              })}
              value={selectedTeachers}
              onChange={(e) => {
                if (e) setSelectedTeachers(e);
                setOption(1);
              }}
              disabled={!getGeneratedSchedule.data}
            />
            <MultiSelect
              style={{
                width: smalScreen ? "100%" : "auto",
              }}
              label="Хичээлгүй үлдээх өдөр"
              data={days?.map((teacher) => {
                return {
                  label: teacher?.weekname,
                  value: teacher?.weekname,
                };
              })}
              value={selectedDays}
              onChange={(e) => {
                if (e) setSelectedDays(e);
                setOption(1);
              }}
              disabled={!getGeneratedSchedule.data}
            />
            <Button
              variant="outline"
              style={{
                width: smalScreen ? "100%" : "auto",
              }}
              onClick={handleDownload}
              rightIcon={<FileDownload />}
            >
              Хуваарь татах
            </Button>
          </Flex>

          <Box
            style={{
              overflowX: "auto",
            }}
            ref={scheduleRef}
          >
            <TimeLine
              loading={getGeneratedSchedule.isLoading}
              courses={[].concat(...(courses?.[option - 1] || []))}
            />
          </Box>
        </Box>
      </Paper>
    </Stack>
  );
};

export default Home;
