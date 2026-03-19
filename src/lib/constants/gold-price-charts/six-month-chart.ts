import { filterPricesRecords } from '@/lib/utils';

export const sixMonthsPricesData = [
  {
    buy_price: 1271363,
    sell_price: 1229397,
    datetime: '19/06/24',
  },
  {
    buy_price: 1297198,
    sell_price: 1254416,
    datetime: '20/06/24',
  },
  {
    buy_price: 1296311,
    sell_price: 1253564,
    datetime: '21/06/24',
  },
  {
    buy_price: 1273066,
    sell_price: 1231083,
    datetime: '22/06/24',
  },
  {
    buy_price: 1272076,
    sell_price: 1229897,
    datetime: '23/06/24',
  },
  {
    buy_price: 1274009,
    sell_price: 1231942,
    datetime: '24/06/24',
  },
  {
    buy_price: 1273681,
    sell_price: 1231741,
    datetime: '25/06/24',
  },
  {
    buy_price: 1269180,
    sell_price: 1227298,
    datetime: '26/06/24',
  },
  {
    buy_price: 1268561,
    sell_price: 1226748,
    datetime: '27/06/24',
  },
  {
    buy_price: 1271139,
    sell_price: 1229246,
    datetime: '28/06/24',
  },
  {
    buy_price: 1267846,
    sell_price: 1226051,
    datetime: '29/06/24',
  },
  {
    buy_price: 1264976,
    sell_price: 1222823,
    datetime: '30/06/24',
  },
  {
    buy_price: 1270893,
    sell_price: 1228984,
    datetime: '01/07/24',
  },
  {
    buy_price: 1272088,
    sell_price: 1230138,
    datetime: '02/07/24',
  },
  {
    buy_price: 1284329,
    sell_price: 1242024,
    datetime: '03/07/24',
  },
  {
    buy_price: 1283335,
    sell_price: 1241047,
    datetime: '04/07/24',
  },
  {
    buy_price: 1291594,
    sell_price: 1249013,
    datetime: '05/07/24',
  },
  {
    buy_price: 1293356,
    sell_price: 1250707,
    datetime: '06/07/24',
  },
  {
    buy_price: 1292910,
    sell_price: 1249100,
    datetime: '07/07/24',
  },
  {
    buy_price: 1292989,
    sell_price: 1250357,
    datetime: '08/07/24',
  },
  {
    buy_price: 1284366,
    sell_price: 1241961,
    datetime: '09/07/24',
  },
  {
    buy_price: 1289093,
    sell_price: 1246544,
    datetime: '10/07/24',
  },
  {
    buy_price: 1298410,
    sell_price: 1255560,
    datetime: '11/07/24',
  },
  {
    buy_price: 1297052,
    sell_price: 1254231,
    datetime: '12/07/24',
  },
  {
    buy_price: 1297027,
    sell_price: 1254233,
    datetime: '13/07/24',
  },
  {
    buy_price: 1294730,
    sell_price: 1250395,
    datetime: '14/07/24',
  },
  {
    buy_price: 1314466,
    sell_price: 1271072,
    datetime: '15/07/24',
  },
  {
    buy_price: 1327479,
    sell_price: 1283662,
    datetime: '16/07/24',
  },
  {
    buy_price: 1334718,
    sell_price: 1290689,
    datetime: '17/07/24',
  },
  {
    buy_price: 1331508,
    sell_price: 1287582,
    datetime: '18/07/24',
  },
  {
    buy_price: 1323276,
    sell_price: 1279608,
    datetime: '19/07/24',
  },
  {
    buy_price: 1296503,
    sell_price: 1253475,
    datetime: '20/07/24',
  },
  {
    buy_price: 1296503,
    sell_price: 1253475,
    datetime: '21/07/24',
  },
  {
    buy_price: 1302373,
    sell_price: 1259382,
    datetime: '22/07/24',
  },
  {
    buy_price: 1302486,
    sell_price: 1259507,
    datetime: '23/07/24',
  },
  {
    buy_price: 1313881,
    sell_price: 1270543,
    datetime: '24/07/24',
  },
  {
    buy_price: 1306873,
    sell_price: 1263749,
    datetime: '25/07/24',
  },
  {
    buy_price: 1295374,
    sell_price: 1252623,
    datetime: '26/07/24',
  },
  {
    buy_price: 1296332,
    sell_price: 1253471,
    datetime: '27/07/24',
  },
  {
    buy_price: 1295998,
    sell_price: 1252980,
    datetime: '28/07/24',
  },
  {
    buy_price: 1304166,
    sell_price: 1261110,
    datetime: '29/07/24',
  },
  {
    buy_price: 1303859,
    sell_price: 1260839,
    datetime: '30/07/24',
  },
  {
    buy_price: 1316223,
    sell_price: 1272787,
    datetime: '31/07/24',
  },
  {
    buy_price: 1332094,
    sell_price: 1288178,
    datetime: '01/08/24',
  },
  {
    buy_price: 1336538,
    sell_price: 1292429,
    datetime: '02/08/24',
  },
  {
    buy_price: 1317008,
    sell_price: 1272522,
    datetime: '03/08/24',
  },
  {
    buy_price: 1317008,
    sell_price: 1272522,
    datetime: '04/08/24',
  },
  {
    buy_price: 1320416,
    sell_price: 1276780,
    datetime: '05/08/24',
  },
  {
    buy_price: 1305209,
    sell_price: 1262062,
    datetime: '06/08/24',
  },
  {
    buy_price: 1289604,
    sell_price: 1245388,
    datetime: '07/08/24',
  },
  {
    buy_price: 1288860,
    sell_price: 1246365,
    datetime: '08/08/24',
  },
  {
    buy_price: 1292999,
    sell_price: 1250338,
    datetime: '09/08/24',
  },
  {
    buy_price: 1293909,
    sell_price: 1251192,
    datetime: '10/08/24',
  },
  {
    buy_price: 1291730,
    sell_price: 1248326,
    datetime: '11/08/24',
  },
  {
    buy_price: 1309914,
    sell_price: 1266686,
    datetime: '12/08/24',
  },
  {
    buy_price: 1316619,
    sell_price: 1273182,
    datetime: '13/08/24',
  },
  {
    buy_price: 1297999,
    sell_price: 1255165,
    datetime: '14/08/24',
  },
  {
    buy_price: 1291492,
    sell_price: 1248821,
    datetime: '15/08/24',
  },
  {
    buy_price: 1306220,
    sell_price: 1263141,
    datetime: '16/08/24',
  },
  {
    buy_price: 1311928,
    sell_price: 1266690,
    datetime: '17/08/24',
  },
  {
    buy_price: 1311928,
    sell_price: 1266416,
    datetime: '18/08/24',
  },
  {
    buy_price: 1311928,
    sell_price: 1268061,
    datetime: '19/08/24',
  },
  {
    buy_price: 1303918,
    sell_price: 1260910,
    datetime: '20/08/24',
  },
  {
    buy_price: 1299619,
    sell_price: 1256738,
    datetime: '21/08/24',
  },
  {
    buy_price: 1310841,
    sell_price: 1267620,
    datetime: '22/08/24',
  },
  {
    buy_price: 1307176,
    sell_price: 1264014,
    datetime: '23/08/24',
  },
  {
    buy_price: 1294227,
    sell_price: 1251564,
    datetime: '24/08/24',
  },
  {
    buy_price: 1289400,
    sell_price: 1245044,
    datetime: '25/08/24',
  },
  {
    buy_price: 1301303,
    sell_price: 1258399,
    datetime: '26/08/24',
  },
  {
    buy_price: 1301622,
    sell_price: 1258680,
    datetime: '27/08/24',
  },
  {
    buy_price: 1303481,
    sell_price: 1260456,
    datetime: '28/08/24',
  },
  {
    buy_price: 1300671,
    sell_price: 1257736,
    datetime: '29/08/24',
  },
  {
    buy_price: 1305055,
    sell_price: 1262020,
    datetime: '30/08/24',
  },
  {
    buy_price: 1295563,
    sell_price: 1252800,
    datetime: '31/08/24',
  },
  {
    buy_price: 1295333,
    sell_price: 1250959,
    datetime: '01/09/24',
  },
  {
    buy_price: 1297066,
    sell_price: 1254264,
    datetime: '02/09/24',
  },
  {
    buy_price: 1300003,
    sell_price: 1257114,
    datetime: '03/09/24',
  },
  {
    buy_price: 1292354,
    sell_price: 1249666,
    datetime: '04/09/24',
  },
  {
    buy_price: 1295746,
    sell_price: 1252997,
    datetime: '05/09/24',
  },
  {
    buy_price: 1296923,
    sell_price: 1254007,
    datetime: '06/09/24',
  },
  {
    buy_price: 1285824,
    sell_price: 1243322,
    datetime: '07/09/24',
  },
  {
    buy_price: 1285723,
    sell_price: 1243119,
    datetime: '08/09/24',
  },
  {
    buy_price: 1290176,
    sell_price: 1247580,
    datetime: '09/09/24',
  },
  {
    buy_price: 1296346,
    sell_price: 1253572,
    datetime: '10/09/24',
  },
  {
    buy_price: 1299758,
    sell_price: 1256852,
    datetime: '11/09/24',
  },
  {
    buy_price: 1313750,
    sell_price: 1270419,
    datetime: '12/09/24',
  },
  {
    buy_price: 1325535,
    sell_price: 1281792,
    datetime: '13/09/24',
  },
  {
    buy_price: 1325809,
    sell_price: 1282096,
    datetime: '14/09/24',
  },
  {
    buy_price: 1323740,
    sell_price: 1279466,
    datetime: '15/09/24',
  },
  {
    buy_price: 1326657,
    sell_price: 1282882,
    datetime: '16/09/24',
  },
  {
    buy_price: 1324625,
    sell_price: 1280892,
    datetime: '17/09/24',
  },
  {
    buy_price: 1317578,
    sell_price: 1274068,
    datetime: '18/09/24',
  },
  {
    buy_price: 1317066,
    sell_price: 1273520,
    datetime: '19/09/24',
  },
  {
    buy_price: 1325675,
    sell_price: 1281934,
    datetime: '20/09/24',
  },
  {
    buy_price: 1325087,
    sell_price: 1281385,
    datetime: '21/09/24',
  },
  {
    buy_price: 1324093,
    sell_price: 1279790,
    datetime: '22/09/24',
  },
  {
    buy_price: 1333220,
    sell_price: 1289260,
    datetime: '23/09/24',
  },
  {
    buy_price: 1339722,
    sell_price: 1295534,
    datetime: '24/09/24',
  },
  {
    buy_price: 1344153,
    sell_price: 1299809,
    datetime: '25/09/24',
  },
  {
    buy_price: 1352857,
    sell_price: 1308257,
    datetime: '26/09/24',
  },
  {
    buy_price: 1348295,
    sell_price: 1303806,
    datetime: '27/09/24',
  },
  {
    buy_price: 1344159,
    sell_price: 1299791,
    datetime: '28/09/24',
  },
  {
    buy_price: 1340080,
    sell_price: 1294450,
    datetime: '29/09/24',
  },
  {
    buy_price: 1342577,
    sell_price: 1298290,
    datetime: '30/09/24',
  },
  {
    buy_price: 1357840,
    sell_price: 1313011,
    datetime: '01/10/24',
  },
  {
    buy_price: 1358665,
    sell_price: 1313878,
    datetime: '02/10/24',
  },
  {
    buy_price: 1370377,
    sell_price: 1325129,
    datetime: '03/10/24',
  },
  {
    buy_price: 1391244,
    sell_price: 1345364,
    datetime: '04/10/24',
  },
  {
    buy_price: 1385735,
    sell_price: 1340035,
    datetime: '05/10/24',
  },
  {
    buy_price: 1384522,
    sell_price: 1338264,
    datetime: '06/10/24',
  },
  {
    buy_price: 1395330,
    sell_price: 1349305,
    datetime: '07/10/24',
  },
  {
    buy_price: 1387263,
    sell_price: 1341453,
    datetime: '08/10/24',
  },
  {
    buy_price: 1370654,
    sell_price: 1325391,
    datetime: '09/10/24',
  },
  {
    buy_price: 1372833,
    sell_price: 1327528,
    datetime: '10/10/24',
  },
  {
    buy_price: 1380418,
    sell_price: 1334860,
    datetime: '11/10/24',
  },
  {
    buy_price: 1381607,
    sell_price: 1336045,
    datetime: '12/10/24',
  },
  {
    buy_price: 1377990,
    sell_price: 1330900,
    datetime: '13/10/24',
  },
  {
    buy_price: 1382987,
    sell_price: 1337354,
    datetime: '14/10/24',
  },
  {
    buy_price: 1383649,
    sell_price: 1338014,
    datetime: '15/10/24',
  },
  {
    buy_price: 1390869,
    sell_price: 1344982,
    datetime: '16/10/24',
  },
  {
    buy_price: 1395389,
    sell_price: 1349389,
    datetime: '17/10/24',
  },
  {
    buy_price: 1401950,
    sell_price: 1355694,
    datetime: '18/10/24',
  },
  {
    buy_price: 1402871,
    sell_price: 1356281,
    datetime: '19/10/24',
  },
  {
    buy_price: 1402526,
    sell_price: 1354863,
    datetime: '20/10/24',
  },
  {
    buy_price: 1414869,
    sell_price: 1368268,
    datetime: '21/10/24',
  },
  {
    buy_price: 1422817,
    sell_price: 1375870,
    datetime: '22/10/24',
  },
  {
    buy_price: 1434889,
    sell_price: 1387560,
    datetime: '23/10/24',
  },
  {
    buy_price: 1423764,
    sell_price: 1376770,
    datetime: '24/10/24',
  },
  {
    buy_price: 1432404,
    sell_price: 1385151,
    datetime: '25/10/24',
  },
  {
    buy_price: 1438049,
    sell_price: 1389125,
    datetime: '26/10/24',
  },
  {
    buy_price: 1436597,
    sell_price: 1387721,
    datetime: '27/10/24',
  },
  {
    buy_price: 1437763,
    sell_price: 1390298,
    datetime: '28/10/24',
  },
  {
    buy_price: 1454200,
    sell_price: 1406240,
    datetime: '29/10/24',
  },
  {
    buy_price: 1460401,
    sell_price: 1412207,
    datetime: '30/10/24',
  },
  {
    buy_price: 1458265,
    sell_price: 1410126,
    datetime: '31/10/24',
  },
  {
    buy_price: 1449173,
    sell_price: 1401302,
    datetime: '01/11/24',
  },
  {
    buy_price: 1450592,
    sell_price: 1402734,
    datetime: '02/11/24',
  },
  {
    buy_price: 1445125,
    sell_price: 1395612,
    datetime: '03/11/24',
  },
  {
    buy_price: 1446378,
    sell_price: 1398629,
    datetime: '04/11/24',
  },
  {
    buy_price: 1443414,
    sell_price: 1395777,
    datetime: '05/11/24',
  },
  {
    buy_price: 1450850,
    sell_price: 1402968,
    datetime: '06/11/24',
  },
  {
    buy_price: 1405076,
    sell_price: 1358726,
    datetime: '07/11/24',
  },
  {
    buy_price: 1409450,
    sell_price: 1362957,
    datetime: '08/11/24',
  },
  {
    buy_price: 1405472,
    sell_price: 1359047,
    datetime: '09/11/24',
  },
  {
    buy_price: 1400376,
    sell_price: 1352393,
    datetime: '10/11/24',
  },
  {
    buy_price: 1401035,
    sell_price: 1354783,
    datetime: '11/11/24',
  },
  {
    buy_price: 1380018,
    sell_price: 1334461,
    datetime: '12/11/24',
  },
  {
    buy_price: 1392843,
    sell_price: 1347370,
    datetime: '13/11/24',
  },
  {
    buy_price: 1366918,
    sell_price: 1321800,
    datetime: '14/11/24',
  },
  {
    buy_price: 1367052,
    sell_price: 1321950,
    datetime: '15/11/24',
  },
  {
    buy_price: 1359417,
    sell_price: 1314521,
    datetime: '16/11/24',
  },
  {
    buy_price: 1358216,
    sell_price: 1311591,
    datetime: '17/11/24',
  },
  {
    buy_price: 1379437,
    sell_price: 1333934,
    datetime: '18/11/24',
  },
  {
    buy_price: 1394013,
    sell_price: 1348031,
    datetime: '19/11/24',
  },
  {
    buy_price: 1403645,
    sell_price: 1357367,
    datetime: '20/11/24',
  },
  {
    buy_price: 1417285,
    sell_price: 1370527,
    datetime: '21/11/24',
  },
  {
    buy_price: 1436270,
    sell_price: 1388908,
    datetime: '22/11/24',
  },
  {
    buy_price: 1444044,
    sell_price: 1393413,
    datetime: '23/11/24',
  },
  {
    buy_price: 1444044,
    sell_price: 1393413,
    datetime: '24/11/24',
  },
  {
    buy_price: 1444256,
    sell_price: 1396642,
    datetime: '25/11/24',
  },
  {
    buy_price: 1396714,
    sell_price: 1350608,
    datetime: '26/11/24',
  },
  {
    buy_price: 1404364,
    sell_price: 1358033,
    datetime: '27/11/24',
  },
  {
    buy_price: 1400219,
    sell_price: 1354013,
    datetime: '28/11/24',
  },
  {
    buy_price: 1408034,
    sell_price: 1361550,
    datetime: '29/11/24',
  },
  {
    buy_price: 1405669,
    sell_price: 1359268,
    datetime: '30/11/24',
  },
  {
    buy_price: 1400151,
    sell_price: 1353748,
    datetime: '01/12/24',
  },
  {
    buy_price: 1404013,
    sell_price: 1357692,
    datetime: '02/12/24',
  },
  {
    buy_price: 1409059,
    sell_price: 1362572,
    datetime: '03/12/24',
  },
  {
    buy_price: 1407664,
    sell_price: 1361216,
    datetime: '04/12/24',
  },
  {
    buy_price: 1405180,
    sell_price: 1358794,
    datetime: '05/12/24',
  },
  {
    buy_price: 1395536,
    sell_price: 1349525,
    datetime: '06/12/24',
  },
  {
    buy_price: 1394159,
    sell_price: 1348203,
    datetime: '07/12/24',
  },
  {
    buy_price: 1391995,
    sell_price: 1344493,
    datetime: '08/12/24',
  },
  {
    buy_price: 1413176,
    sell_price: 1366546,
    datetime: '09/12/24',
  },
  {
    buy_price: 1423688,
    sell_price: 1376720,
    datetime: '10/12/24',
  },
  {
    buy_price: 1443982,
    sell_price: 1396336,
    datetime: '11/12/24',
  },
  {
    buy_price: 1447549,
    sell_price: 1399780,
    datetime: '12/12/24',
  },
  {
    buy_price: 1436434,
    sell_price: 1388984,
    datetime: '13/12/24',
  },
  {
    buy_price: 1420843,
    sell_price: 1373926,
    datetime: '14/12/24',
  },
  {
    buy_price: 1414344,
    sell_price: 1364662,
    datetime: '15/12/24',
  },
  {
    buy_price: 1421386,
    sell_price: 1374442,
    datetime: '16/12/24',
  },
  {
    buy_price: 1425277,
    sell_price: 1378173,
    datetime: '17/12/24',
  },
  {
    buy_price: 1422353,
    sell_price: 1375340,
    datetime: '18/12/24',
  },
  {
    buy_price: 1442511,
    sell_price: 1394920,
    datetime: '19/12/24',
  },
  {
    buy_price: 1411987,
    sell_price: 1365359,
    datetime: '19/12/24 - 22:45',
  },
];

export const sixMonthChart = {
  jsonapi: {
    version: '1.0',
  },
  data: {
    type: 'gold-price',
    attributes: {
      price: 140624,
      percentage: 11.06,
      movement: 'profit',
      prices: filterPricesRecords(sixMonthsPricesData, [
        '01',
        '05',
        '10',
        '15',
        '20',
        '25',
        '30',
      ]),
      // prices: sixMonthsPricesData,
    },
  },
};
