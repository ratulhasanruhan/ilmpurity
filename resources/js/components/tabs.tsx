import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';
import { TabsProps } from '@radix-ui/react-tabs';
import React from 'react';
import { Tabs as TabsContainer } from './ui/tabs';

interface Props extends TabsProps {
   children: React.ReactNode;
}

const Tabs = ({ children, ...props }: Props) => {
   const page = usePage<SharedData>();

   return (
      <TabsContainer dir={page.props.direction} {...props}>
         {children}
      </TabsContainer>
   );
};

export default Tabs;
