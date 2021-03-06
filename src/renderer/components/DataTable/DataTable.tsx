import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import SkeletonLoader from 'tiny-skeleton-loader-react';
import shallow from 'zustand/shallow';
import useStore, { IStore } from '../../hooks/useStore';
import { columnsDefinition, columnsToShow } from './columnsDefenition';
import processData from './dataProcessing';

const DataTable = () => {
  const [
    currentData,
    dataType,
    currentDataIsLoaded,
    fetchAndSetManyTickerData,
    fetchAndSetOneTickerData,
    showOneTickerData,
    selectedDate,
    manyTickersDataIsLoaded,
  ] = useStore(
    (state: IStore) => [
      state.currentData,
      state.dataType,
      state.currentDataIsLoaded,
      state.fetchAndSetManyTickerData,
      state.fetchAndSetOneTickerData,
      state.showOneTickerData,
      state.selectedDate,
      state.manyTickersDataIsLoaded,
    ],
    shallow
  );

  const [columns, setColumns] = useState(columnsDefinition);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const newColumns = columns.map((column) => {
      if (!columnsToShow[dataType].includes(column.field)) {
        return { ...column, hide: true };
      }
      return { ...column, hide: false };
    });

    setColumns(newColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataType]);

  useEffect(() => {
    if (showOneTickerData) {
      fetchAndSetOneTickerData();
    }
    fetchAndSetManyTickerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  if (
    (!showOneTickerData &&
      manyTickersDataIsLoaded &&
      currentDataIsLoaded &&
      currentData !== null) ||
    (currentDataIsLoaded && currentData !== null)
  ) {
    return (
      <>
        <DataGrid
          rows={processData(currentData[dataType], dataType)}
          columns={columns}
          autoHeight
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          pageSize={pageSize}
        />
      </>
    );
  }

  return <SkeletonLoader style={{ width: '100%', minHeight: 630 }} />;
};

export default DataTable;
