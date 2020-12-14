import { IconButton, Tooltip } from '@material-ui/core'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import React, { useEffect, useMemo, useRef } from 'react'
import { createColumns, CrudRefProps, useWindowSize } from 'material-crud'
import FullCrud, { WSResponse } from '../components/FullCrud'
import Urls from '../util/Urls'
import useAxios from '../util/useAxios'
import { FaPlusCircle } from 'react-icons/fa'

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

  if (loadingListeners || loadingC2) return null

  return (
    <FullCrud
      ref={(e) => (crudRef.current = e)}
      itemName="hostname"
      height={height - 110}
      columns={columns}
      url={Urls.agents}
      name="Agents"
      actions={{ edit: false, delete: true }}
      extraActions={(rowData) => [
        <Tooltip title="Interact" key="interact">
          <IconButton onClick={() => history.push('/detail_agent', rowData)}>
            <FaPlusCircle />
          </IconButton>
        </Tooltip>,
      ]}
    />
  )
}
