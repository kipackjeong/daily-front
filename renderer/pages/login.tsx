import { useEffect, useRef, useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  FormControl,
  FormHelperText,
  InputRightElement,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock, FaMailBulk } from "react-icons/fa";
import axios from "axios";
import Router from "next/router";
import IUser from "../lib/models/user/user";
import { useDispatch } from "react-redux";
import { userActions } from "../lib/redux/slices/user.slice";
import IconWrapper from "../core/components/IconWrapper";
import axiosInstance from "../lib/utils/axios";
import { useAppStatus } from "../lib/hooks/useAppStatus";
import authLocalService from "../lib/services/auth.local-service";

const login = () => {
  const CFaLock = chakra(FaLock);
  const CFaEmail = chakra(FaMailBulk);

  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const router = Router;

  const dispatch = useDispatch();

  const { setIsOnline } = useAppStatus();

  function showClickHandler() {
    setShowPassword(!showPassword);
  }

  async function onSubmitHandler(e) {
    e.preventDefault();
    const email = emailRef!.current.value;
    const password = passwordRef!.current.value;

    // #region call api to /login
    // TODO: handle cors error.
    try {
      // the cookie will get setted
      setIsOnline(true);
      await authLocalService.setOnlineStatus(true);

      const res = await axiosInstance.post(
        "/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      const user: IUser = res.data.data;

      dispatch(userActions.setUser(user));

      router.push("/home");
    } catch (error) {
      setIsValid(false);
    }
    // #endregion
  }

  async function useLocalClickHandler(e) {
    setIsOnline(false);
    await authLocalService.setOnlineStatus(false);

    dispatch(
      userActions.setUser({
        _id: "",
        email: "",
        password: "",
        firstname: "",
        lastname: "",
      })
    );
    router.push("/home");
  }

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100vh"
      backgroundColor="brand.lightGray"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        // TODO: logo goes here
        <Heading color="brand.heavy">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={onSubmitHandler}>
            <Stack
              spacing={4}
              p="2rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              {/* email */}
              <FormControl isRequired isInvalid={!isValid}>
                <FormErrorMessage>
                  The user with given email and password does not exist.
                </FormErrorMessage>

                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaEmail color="gray.300" />}
                  />
                  <Input
                    ref={emailRef}
                    type="email"
                    placeholder="email address"
                  />
                </InputGroup>
              </FormControl>
              {/* email */}
              <FormControl isRequired isInvalid={!isValid}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={showClickHandler}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                backgroundColor={"brand.heavy"}
                _hover={{ backgroundColor: "brand.regular" }}
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{" "}
        <Link color="teal.500" href="/signup">
          Sign Up
        </Link>
      </Box>
      <Box>
        <Link color="teal.500" onClick={useLocalClickHandler}>
          Use local
        </Link>
      </Box>
    </Flex>
  );
};

export default login;
