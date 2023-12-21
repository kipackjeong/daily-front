import { Flex, FlexProps } from '@chakra-ui/react';
import React from 'react';

interface PageLayoutProps extends FlexProps {}

const PageLayout = ({ children }: PageLayoutProps) => {
	return (
		<>
			<Flex
				mt={{ base: '70px', md: 0, sm: 0 }}
				className="page-layout"
				height={{ base: '100%' }}
				width="100%"
				py={{ base: 1, md: 5 }}
				px={{ base: 1, md: 5 }}
				flexDir="column"
				position="relative"
				overflowY="hidden"
			>
				{children}
			</Flex>
		</>
	);
};

export default PageLayout;
