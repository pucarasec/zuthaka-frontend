import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import { createColumns, CrudRefProps, TableTypes, useWindowSize } from 'material-crud'
import FullCrud, { WSResponse } from '../components/FullCrud'
import Urls from '../util/Urls'
import useAxios from '../util/useAxios'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { makeStyles } from '@material-ui/core'
import 'react-tabs/style/react-tabs.css'
import DetailWrapper, { DetailWrapperProps } from '../components/DetailWrapper'
import Storage from '../util/Storage'

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

  const [lastAgents, setLastAgents] = useState<DetailWrapperProps[]>(
    Storage.getItem('LastAgents') || [],
  )
  const callSetAgents = useCallback((rowData, removeFirst?: boolean) => {
    setLastAgents((acc) => {
      if (removeFirst) acc.shift()
      const data = [...acc, rowData]
      Storage.saveItem('LastAgents', data)
      return data
    })
  }, [])

  const [value, setValue] = useState(0)
  const selectAgent = useCallback((newValue: number) => setValue(newValue), [])

  const handleChange = useCallback(
    (event, rowData: DetailWrapperProps) => {
      if (!rowData.active) return
      if (lastAgents.length < 3 && !lastAgents.some(({ id }) => id === rowData.id)) {
        callSetAgents(rowData)
        selectAgent(lastAgents.length + 1)
      } else {
        const index = lastAgents.findIndex(({ id }) => id === rowData.id)
        if (index >= 0) selectAgent(index + 1)
        else {
          callSetAgents(rowData, true)
          selectAgent(lastAgents.length + 1)
        }
      }
    },
    [lastAgents, selectAgent, callSetAgents],
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
          width: 2,
          align: 'center',
          cellComponent: ({ rowData }) =>
            c2Types?.results.find((x) => x.id === rowData.c2)?.name || '-',
        },
        {
          id: 'listener',
          title: 'Listener',
          width: 2,
          align: 'center',
          cellComponent: ({ rowData }) =>
            listenersTypes?.results.find((x) => x.id === rowData.listener)?.name || '-',
        },
        { id: 'username', title: 'Username', width: 2, align: 'center' },
        { id: 'hostname', title: 'Hostname', width: 3, align: 'center' },
        { id: 'active', title: 'Active', width: 1.5, align: 'center', type: TableTypes.Switch },
      ]),
    [c2Types, listenersTypes],
  )

  return (
    <div className={classes.root}>
      <Tabs selectedIndex={value} onSelect={selectAgent}>
        <TabList>
          <Tab>Agents</Tab>
          {lastAgents.map(({ hostname, id, active }: DetailWrapperProps) => (
            <Tab disabled={!active} key={id}>
              {hostname}
            </Tab>
          ))}
        </TabList>
        <TabPanel>
          <FullCrud
            noBorder={false}
            ref={(e) => (crudRef.current = e)}
            itemName="hostname"
            height={height - 200}
            columns={columns}
            url={Urls.agents}
            name="Agents"
            rowStyle={({ active }: DetailWrapperProps) => {
              if (active) return {}
              return {
                pointerEvents: 'none',
                cursor: 'not-allowed',
                backgroundColor: '#fafafa',
              }
            }}
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
    padding: theme.spacing(1),
    marginLeft: 30,
    marginRight: 30,
  },
}))
