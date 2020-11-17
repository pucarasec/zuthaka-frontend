export const crudInteractions = { page: 'page', perPage: 'limit' }

export const crudResponse = {
  list: (cList: any) => ({
    items: cList.results,
    page: cList.current,
    limit: 10,
    totalDocs: cList.count,
  }),
  new: (data: any, response: any) => response,
  edit: (data: any, response: any) => response,
}
