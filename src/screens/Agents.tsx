import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import { createColumns, CrudRefProps, useWindowSize } from 'material-crud'
import FullCrud, { WSResponse } from '../components/FullCrud'
import Urls from '../util/Urls'
import useAxios from '../util/useAxios'
import ZTab from '../components/ZTab'
import Storage from '../util/Storage'
import DetailAgent from './agents/DetailAgent'
import { AgentProps } from './agents/DetailAgent'

export default () => {
  useNavigatorConfig({ title: 'Agents', noPadding: false, goBack: false })
  const crudRef = useRef<CrudRefProps | null>(null)
  const { height } = useWindowSize()
  const { setLoading, history } = useNavigator()

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

  const refSelected = useRef<boolean>(false)
  const [lastAgents, setLastAgents] = useState<AgentProps[]>([])
  const [value, setValue] = useState(0)
  const selectAgent = useCallback((newValue: number) => setValue(newValue), [])

  const handleChange = useCallback(
    (event, rowData: AgentProps, index) => {
      if (lastAgents.length < 3 && !lastAgents.some(({ id }) => id === rowData.id)) {
        setLastAgents((acc) => [...acc, rowData])
        refSelected.current = true
      } else {
        const index = lastAgents.findIndex(({ id }) => id === rowData.id)
        if (index >= 0) selectAgent(index + 1)
      }
      crudRef.current?.refresh()
    },
    [lastAgents, selectAgent],
  )

  useEffect(() => {
    if (refSelected.current) {
      selectAgent(lastAgents.length)
      refSelected.current = false
    }
  }, [lastAgents, selectAgent])

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
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ZTab
        value={value}
        setValue={selectAgent}
        tabs={[
          { label: 'Agents' },
          ...lastAgents.map(({ hostname }: AgentProps) => ({ label: hostname })),
        ]}
        tabsPanel={[
          {
            children: (
              <FullCrud
                ref={(e) => (crudRef.current = e)}
                itemName="hostname"
                height={height - 200}
                columns={columns}
                url={Urls.agents}
                name="Agents"
                actions={{ edit: false, delete: true }}
                onClickRow={handleChange}
                // onClickRow={(event, rowData) => history.push('/detail_agent', rowData)}
              />
            ),
          },
          ...lastAgents.map((item) => ({ children: <span>{item.c2}</span> })),
        ]}
      />
    </div>
  )
}
