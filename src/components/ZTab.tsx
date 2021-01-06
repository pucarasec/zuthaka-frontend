import React, { ReactNode, useCallback, useState } from 'react'
import { AppBar, makeStyles, Tab, Tabs } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import TabPanel from './TabPanel'
import { useWindowSize } from 'material-crud'

interface TabProps {
  tabs: { label: string }[]
  tabsPanel: { children: ReactNode }[]
  indicatorColor?: 'primary' | 'secondary'
  textColor?: 'inherit' | 'primary' | 'secondary'
}

interface AppbarProps {
  appbarPosition?: 'fixed' | 'absolute' | 'relative' | 'static' | 'sticky'
  appbarVariant?: 'elevation' | 'outlined'
  appbarColor?: 'primary' | 'secondary' | 'inherit' | 'transparent' | 'default'
}

type ZTabProps = TabProps & AppbarProps

export default React.forwardRef<HTMLButtonElement, ZTabProps>((props, ref) => {
  const { tabs, tabsPanel, indicatorColor, textColor } = props
  const { appbarPosition, appbarColor, appbarVariant } = props

  const [value, setValue] = useState(0)
  const { height } = useWindowSize()
  const classes = useClasses({ height })

  const handleChange = useCallback((newValue: number) => setValue(newValue), [])

  return (
    <React.Fragment>
      <AppBar
        position={appbarPosition || 'static'}
        color={appbarColor || 'default'}
        variant={appbarVariant || 'outlined'}
        className={classes.appbar}>
        <Tabs
          ref={ref}
          value={value}
          onChange={(_, newValue) => handleChange(newValue)}
          indicatorColor={indicatorColor || 'primary'}
          textColor={textColor || 'primary'}>
          {tabs.map(({ label }) => (
            <Tab label={label} />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews index={value} onChangeIndex={handleChange}>
        {tabsPanel.map(({ children }, i) => (
          <TabPanel value={value} index={i}>
            {children}
          </TabPanel>
        ))}
      </SwipeableViews>
    </React.Fragment>
  )
})

const useClasses = makeStyles((theme) => ({
  appbar: ({ height }: any) => ({
    margin: theme.spacing(1),
  }),
  tabbar: {
    flex: 1,
  },
  tabs: {
    padding: theme.spacing(2),
    flex: 1,
  },
}))
