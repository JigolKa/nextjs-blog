import { useEffect, useState } from "react";

export default function useStringData<R>(data: string): R {
 const [_data, _setData] = useState<R>();

 useEffect(() => {
  if (data) {
   _setData(JSON.parse(data));
  }
 }, [data]);

 return _data as R;
}
