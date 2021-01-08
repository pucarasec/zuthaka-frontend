import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import { createColumns, CrudRefProps, useWindowSize } from 'material-crud'
import FullCrud, { WSResponse } from '../components/FullCrud'
import Urls from '../util/Urls'
import useAxios from '../util/useAxios'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { makeStyles } from '@material-ui/core'
import 'react-tabs/style/react-tabs.css'
import DetailWrapper, { DetailWrapperProps } from '../components/DetailWrapper'

export default () => {
  useNavigatorConfig({ title: 'Agents', noPadding: false, goBack: false })
  const crudRef = useRef<CrudRefProps | null>(null)
  const { height } = useWindowSize()
  const { setLoading } = useNavigator()
  const classes = useClasses()

  const [listenersTypes, loadingListeners] = useAxios<WSResponse<any[]>>({
    onInit: {
      url: Urls.listeners_types,
    },
  })

  const [c2Types, loadingC2] = useAxios<WSResponse<any[]>>({
    onInit: {
      url: Urls.c2_types,
    },
  })

  const [lastAgents, setLastAgents] = useState<DetailWrapperProps[]>([])
  const [value, setValue] = useState(0)
  const selectAgent = useCallback((newValue: number) => setValue(newValue), [])

  const handleChange = useCallback(
    (event, rowData: DetailWrapperProps, index) => {
      if (lastAgents.length < 3 && !lastAgents.some(({ id }) => id === rowData.id)) {
        setLastAgents((acc) => [...acc, rowData])
        selectAgent(lastAgents.length + 1)
      } else {
        const index = lastAgents.findIndex(({ id }) => id === rowData.id)
        if (index >= 0) selectAgent(index + 1)
      }
    },
    [lastAgents, selectAgent],
  )

  useEffect(() => {
    setLoading(loadingListeners || loadingC2)
  }, [loadingListeners, setLoading, loadingC2])

  const columns = useMemo(
    () =>
      createColumns([
        {
          id: 'id',
          title: 'ID',
          width: 1,
          align: 'center',
        },
        {
          id: 'c2',
          title: 'C2',
          width: 1,
          align: 'center',
          cellComponent: ({ rowData }) =>
            c2Types?.results.find((x) => x.id === rowData.c2)?.name || '-',
        },
        {
          id: 'listener',
          title: 'Listener',
          width: 1,
          align: 'center',
          cellComponent: ({ rowData }) =>
            listenersTypes?.results.find((x) => x.id === rowData.listener)?.name || '-',
        },
        { id: 'username', title: 'Username', width: 2 },
        { id: 'hostname', title: 'Hostname', width: 2 },
      ]),
    [c2Types, listenersTypes],
  )

  return (
    <div className={classes.root}>
      <Tabs selectedIndex={value} onSelect={selectAgent}>
        <TabList>
          <Tab>Agents</Tab>
          {lastAgents.map(({ hostname, id }: DetailWrapperProps) => (
            <Tab key={id}>{hostname}</Tab>
          ))}
        </TabList>
        <TabPanel>
          <FullCrud
            ref={(e) => (crudRef.current = e)}
            itemName="hostname"
            height={height - 200}
            columns={columns}
            url={Urls.agents}
            name="Agents"
            actions={{ edit: false, delete: true }}
            onClickRow={handleChange}
          />
        </TabPanel>
        {lastAgents.map((item: DetailWrapperProps) => (
          <TabPanel key={item.id}>
            <DetailWrapper {...item} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  )
}

const useClasses = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    marginLeft: 60,
    marginRight: 60,
  },
}))
