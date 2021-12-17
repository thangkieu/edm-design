import { memo, useCallback, useState } from 'react';
import styled, { css } from 'styled-components';

type TabConfig = {
  name: string;
  content: any;
};
interface EMDDesignRendererProps {
  className?: string;
  tabs: TabConfig[];
}

const Wrapper = styled.div`
  background-color: white;
`;

const TabHeaders = styled.div`
  display: flex;
`;

const TabHeader = styled.h4<{ active?: boolean }>`
  padding: 1rem;
  text-align: center;
  flex: 1 1 0%;
  margin: 0;
  cursor: pointer;
  
  ${({ active, theme }) =>
    active
      ? css`
          color: ${theme.colors.primary};
        `
      : css`
          color: white;
          background-color: ${theme.colors.disabled};
        `}}
`;

export const Tabs = memo<EMDDesignRendererProps>((props) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = useCallback((index) => {
    setActiveTab(index);
  }, []);

  return (
    <Wrapper className={props.className}>
      <TabHeaders>
        {props.tabs.map((tab, index) => (
          <TabHeader
            active={activeTab === index}
            key={tab.name}
            onClick={() => handleTabChange(index)}
          >
            {tab.name}
          </TabHeader>
        ))}
      </TabHeaders>
      {props.tabs[activeTab].content}
    </Wrapper>
  );
});
