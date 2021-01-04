import React, { useEffect, useLayoutEffect, useMemo } from 'react'
import { useNavigator, useNavigatorConfig } from 'material-navigator'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import am4themes_dark from '@amcharts/amcharts4/themes/dark'
import am4themes_spiritedaway from '@amcharts/amcharts4/themes/spiritedaway'
import useAxios from '../util/useAxios'
import Urls from '../util/Urls'
import { WSResponse } from '../components/FullCrud'
import { useColorTheme } from '../util/Theme'

export default () => {
  const { color } = useColorTheme()

  useNavigatorConfig({ title: 'Dashboard', noPadding: false })
  const { setLoading } = useNavigator()

  const [c2, loadingC2] = useAxios<WSResponse<any[]>>({ onInit: { url: Urls.c2 } })
  const [c2_types, loadingC2_types] = useAxios<WSResponse<any[]>>({
    onInit: { url: Urls.c2_types },
  })

  const [listener, loadingListener] = useAxios<WSResponse<any[]>>({
    onInit: { url: Urls.listeners },
  })
  const [listenerTypes, loadingListener_types] = useAxios<WSResponse<any[]>>({
    onInit: {
      url: Urls.listeners_types,
    },
  })

  const c2_grouped = useMemo(
    () =>
      c2_types?.results.map(({ id, name }: any) => ({
        total: c2?.results.filter(({ c2_type }: any) => c2_type === id).length,
        name,
      })),
    [c2_types, c2],
  )

  const listener_grouped = useMemo(
    () =>
      listenerTypes?.results.map(({ id, name }: any) => ({
        total: listener?.results.filter(({ listener_type }: any) => listener_type === id).length,
        name,
      })),
    [listenerTypes, listener],
  )

  useEffect(() => {
    setLoading(loadingC2 || loadingC2_types || loadingListener || loadingListener_types)
  }, [setLoading, loadingC2, loadingC2_types, loadingListener, loadingListener_types])

  useLayoutEffect(() => {
    if (color === 'dark') {
      am4core.unuseAllThemes()
      am4core.useTheme(am4themes_animated)
      am4core.useTheme(am4themes_dark)
    } else {
      am4core.unuseAllThemes()
      am4core.useTheme(am4themes_animated)
      am4core.useTheme(am4themes_spiritedaway)
    }

    const container = am4core.create('chartdiv', am4core.Container)
    container.width = am4core.percent(100)
    container.height = am4core.percent(100)
    container.layout = 'horizontal'

    const c2chart = container.createChild(am4charts.XYChart)
    c2chart.data = c2_grouped || []

    const dateAxis = c2chart.xAxes.push(new am4charts.CategoryAxis())
    dateAxis.dataFields.category = 'name'
    dateAxis.renderer.grid.template.location = 0

    c2chart.yAxes.push(new am4charts.ValueAxis())

    const series = c2chart.series.push(new am4charts.ColumnSeries())
    series.dataFields.categoryX = 'name'
    series.dataFields.valueY = 'total'
    series.name = 'C2'
    series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]'
    series.columns.template.fillOpacity = 0.8

    const listenerChart = container.createChild(am4charts.PieChart)
    listenerChart.data = listener_grouped || []

    let pieSeries = listenerChart.series.push(new am4charts.PieSeries())
    pieSeries.dataFields.value = 'total'
    pieSeries.dataFields.category = 'name'
    pieSeries.slices.template.stroke = am4core.color('#fff')
    pieSeries.slices.template.strokeOpacity = 1

    pieSeries.hiddenState.properties.opacity = 1
    pieSeries.hiddenState.properties.endAngle = -90
    pieSeries.hiddenState.properties.startAngle = -90

    listenerChart.hiddenState.properties.radius = am4core.percent(0)

    const tags = document.getElementsByTagName('title')
    for (const tag of tags) {
      if (tag.textContent === 'Chart created using amCharts library') {
        const g = tag.parentElement
        g?.parentNode?.removeChild(g)
      }
    }

    return () => container.dispose()
  }, [c2_grouped, color, listener_grouped])

  return <div id="chartdiv" style={{ width: '100%', height: 350 }} />
}
