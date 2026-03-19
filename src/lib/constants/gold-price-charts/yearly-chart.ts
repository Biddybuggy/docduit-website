import { filterPricesRecords } from '@/lib/utils';

export const yearlyPricesData = [
  {
    buy_price: 1054192,
    sell_price: 1019443,
    datetime: '19/12/23',
  },
  {
    buy_price: 1055060,
    sell_price: 1020283,
    datetime: '20/12/23',
  },
  {
    buy_price: 1055515,
    sell_price: 1020576,
    datetime: '21/12/23',
  },
  {
    buy_price: 1070281,
    sell_price: 1035002,
    datetime: '22/12/23',
  },
  {
    buy_price: 1059107,
    sell_price: 1024196,
    datetime: '23/12/23',
  },
  {
    buy_price: 1056861,
    sell_price: 1020459,
    datetime: '24/12/23',
  },
  {
    buy_price: 1056872,
    sell_price: 1020468,
    datetime: '25/12/23',
  },
  {
    buy_price: 1060545,
    sell_price: 1025558,
    datetime: '26/12/23',
  },
  {
    buy_price: 1065702,
    sell_price: 1030569,
    datetime: '27/12/23',
  },
  {
    buy_price: 1070614,
    sell_price: 1035306,
    datetime: '28/12/23',
  },
  {
    buy_price: 1070029,
    sell_price: 1034729,
    datetime: '29/12/23',
  },
  {
    buy_price: 1058770,
    sell_price: 1023856,
    datetime: '30/12/23',
  },
  {
    buy_price: 1055849,
    sell_price: 1019898,
    datetime: '31/12/23',
  },
  {
    buy_price: 1055849,
    sell_price: 1019898,
    datetime: '01/01/24',
  },
  {
    buy_price: 1070205,
    sell_price: 1034939,
    datetime: '02/01/24',
  },
  {
    buy_price: 1065159,
    sell_price: 1030009,
    datetime: '03/01/24',
  },
  {
    buy_price: 1057930,
    sell_price: 1023033,
    datetime: '04/01/24',
  },
  {
    buy_price: 1061998,
    sell_price: 1027011,
    datetime: '05/01/24',
  },
  {
    buy_price: 1057688,
    sell_price: 1022814,
    datetime: '06/01/24',
  },
  {
    buy_price: 1054758,
    sell_price: 1019173,
    datetime: '07/01/24',
  },
  {
    buy_price: 1054780,
    sell_price: 1019977,
    datetime: '08/01/24',
  },
  {
    buy_price: 1054564,
    sell_price: 1019797,
    datetime: '09/01/24',
  },
  {
    buy_price: 1055587,
    sell_price: 1020787,
    datetime: '10/01/24',
  },
  {
    buy_price: 1053675,
    sell_price: 1018938,
    datetime: '11/01/24',
  },
  {
    buy_price: 1065107,
    sell_price: 1029994,
    datetime: '12/01/24',
  },
  {
    buy_price: 1059902,
    sell_price: 1024885,
    datetime: '13/01/24',
  },
  {
    buy_price: 1058757,
    sell_price: 1023497,
    datetime: '14/01/24',
  },
  {
    buy_price: 1063720,
    sell_price: 1028647,
    datetime: '15/01/24',
  },
  {
    buy_price: 1064218,
    sell_price: 1029119,
    datetime: '16/01/24',
  },
  {
    buy_price: 1056917,
    sell_price: 1022077,
    datetime: '17/01/24',
  },
  {
    buy_price: 1047578,
    sell_price: 1013031,
    datetime: '18/01/24',
  },
  {
    buy_price: 1057811,
    sell_price: 1022918,
    datetime: '19/01/24',
  },
  {
    buy_price: 1054633,
    sell_price: 1018905,
    datetime: '20/01/24',
  },
  {
    buy_price: 1054633,
    sell_price: 1018533,
    datetime: '21/01/24',
  },
  {
    buy_price: 1057233,
    sell_price: 1022393,
    datetime: '22/01/24',
  },
  {
    buy_price: 1060095,
    sell_price: 1025150,
    datetime: '23/01/24',
  },
  {
    buy_price: 1062947,
    sell_price: 1027919,
    datetime: '24/01/24',
  },
  {
    buy_price: 1084300,
    sell_price: 1048552,
    datetime: '25/01/24',
  },
  {
    buy_price: 1065862,
    sell_price: 1030697,
    datetime: '26/01/24',
  },
  {
    buy_price: 1059639,
    sell_price: 1024372,
    datetime: '27/01/24',
  },
  {
    buy_price: 1058782,
    sell_price: 1023536,
    datetime: '28/01/24',
  },
  {
    buy_price: 1071952,
    sell_price: 1036612,
    datetime: '29/01/24',
  },
  {
    buy_price: 1073646,
    sell_price: 1038281,
    datetime: '30/01/24',
  },
  {
    buy_price: 1076680,
    sell_price: 1041210,
    datetime: '31/01/24',
  },
  {
    buy_price: 1079968,
    sell_price: 1044370,
    datetime: '01/02/24',
  },
  {
    buy_price: 1078703,
    sell_price: 1043157,
    datetime: '02/02/24',
  },
  {
    buy_price: 1066950,
    sell_price: 1031613,
    datetime: '03/02/24',
  },
  {
    buy_price: 1066950,
    sell_price: 1031416,
    datetime: '04/02/24',
  },
  {
    buy_price: 1067797,
    sell_price: 1032538,
    datetime: '05/02/24',
  },
  {
    buy_price: 1067707,
    sell_price: 1032507,
    datetime: '06/02/24',
  },
  {
    buy_price: 1067438,
    sell_price: 1032257,
    datetime: '07/02/24',
  },
  {
    buy_price: 1060846,
    sell_price: 1025862,
    datetime: '08/02/24',
  },
  {
    buy_price: 1060551,
    sell_price: 1025596,
    datetime: '09/02/24',
  },
  {
    buy_price: 1052743,
    sell_price: 1018031,
    datetime: '10/02/24',
  },
  {
    buy_price: 1051084,
    sell_price: 1016091,
    datetime: '11/02/24',
  },
  {
    buy_price: 1053330,
    sell_price: 1018589,
    datetime: '12/02/24',
  },
  {
    buy_price: 1055248,
    sell_price: 1020479,
    datetime: '13/02/24',
  },
  {
    buy_price: 1041353,
    sell_price: 1006995,
    datetime: '14/02/24',
  },
  {
    buy_price: 1042044,
    sell_price: 1007699,
    datetime: '15/02/24',
  },
  {
    buy_price: 1046151,
    sell_price: 1011596,
    datetime: '16/02/24',
  },
  {
    buy_price: 1048115,
    sell_price: 1013540,
    datetime: '17/02/24',
  },
  {
    buy_price: 1047968,
    sell_price: 1013332,
    datetime: '18/02/24',
  },
  {
    buy_price: 1051355,
    sell_price: 1016694,
    datetime: '19/02/24',
  },
  {
    buy_price: 1057201,
    sell_price: 1022358,
    datetime: '20/02/24',
  },
  {
    buy_price: 1058038,
    sell_price: 1023182,
    datetime: '21/02/24',
  },
  {
    buy_price: 1056001,
    sell_price: 1021192,
    datetime: '22/02/24',
  },
  {
    buy_price: 1056879,
    sell_price: 1022041,
    datetime: '23/02/24',
  },
  {
    buy_price: 1058179,
    sell_price: 1023303,
    datetime: '24/02/24',
  },
  {
    buy_price: 1055477,
    sell_price: 1020440,
    datetime: '25/02/24',
  },
  {
    buy_price: 1059685,
    sell_price: 1024759,
    datetime: '26/02/24',
  },
  {
    buy_price: 1061426,
    sell_price: 1026423,
    datetime: '27/02/24',
  },
  {
    buy_price: 1064766,
    sell_price: 1029663,
    datetime: '28/02/24',
  },
  {
    buy_price: 1071971,
    sell_price: 1036641,
    datetime: '29/02/24',
  },
  {
    buy_price: 1087227,
    sell_price: 1051421,
    datetime: '01/03/24',
  },
  {
    buy_price: 1090461,
    sell_price: 1054523,
    datetime: '02/03/24',
  },
  {
    buy_price: 1087875,
    sell_price: 1051432,
    datetime: '03/03/24',
  },
  {
    buy_price: 1108958,
    sell_price: 1072417,
    datetime: '04/03/24',
  },
  {
    buy_price: 1120553,
    sell_price: 1083630,
    datetime: '05/03/24',
  },
  {
    buy_price: 1118650,
    sell_price: 1081785,
    datetime: '06/03/24',
  },
  {
    buy_price: 1125257,
    sell_price: 1088226,
    datetime: '07/03/24',
  },
  {
    buy_price: 1126652,
    sell_price: 1089455,
    datetime: '08/03/24',
  },
  {
    buy_price: 1133593,
    sell_price: 1096253,
    datetime: '09/03/24',
  },
  {
    buy_price: 1126024,
    sell_price: 1088783,
    datetime: '10/03/24',
  },
  {
    buy_price: 1134311,
    sell_price: 1096871,
    datetime: '11/03/24',
  },
  {
    buy_price: 1127754,
    sell_price: 1090572,
    datetime: '12/03/24',
  },
  {
    buy_price: 1125799,
    sell_price: 1088693,
    datetime: '13/03/24',
  },
  {
    buy_price: 1127555,
    sell_price: 1090393,
    datetime: '14/03/24',
  },
  {
    buy_price: 1128271,
    sell_price: 1091081,
    datetime: '15/03/24',
  },
  {
    buy_price: 1123772,
    sell_price: 1086730,
    datetime: '16/03/24',
  },
  {
    buy_price: 1121482,
    sell_price: 1084409,
    datetime: '17/03/24',
  },
  {
    buy_price: 1129966,
    sell_price: 1092719,
    datetime: '18/03/24',
  },
  {
    buy_price: 1132813,
    sell_price: 1095457,
    datetime: '19/03/24',
  },
  {
    buy_price: 1132935,
    sell_price: 1095620,
    datetime: '20/03/24',
  },
  {
    buy_price: 1154969,
    sell_price: 1116446,
    datetime: '21/03/24',
  },
  {
    buy_price: 1147227,
    sell_price: 1109431,
    datetime: '22/03/24',
  },
  {
    buy_price: 1140244,
    sell_price: 1102266,
    datetime: '23/03/24',
  },
  {
    buy_price: 1138706,
    sell_price: 1100780,
    datetime: '24/03/24',
  },
  {
    buy_price: 1144241,
    sell_price: 1106525,
    datetime: '25/03/24',
  },
  {
    buy_price: 1154823,
    sell_price: 1116713,
    datetime: '26/03/24',
  },
  {
    buy_price: 1160602,
    sell_price: 1122321,
    datetime: '27/03/24',
  },
  {
    buy_price: 1174544,
    sell_price: 1135814,
    datetime: '28/03/24',
  },
  {
    buy_price: 1181857,
    sell_price: 1142243,
    datetime: '29/03/24',
  },
  {
    buy_price: 1180836,
    sell_price: 1141255,
    datetime: '30/03/24',
  },
  {
    buy_price: 1179728,
    sell_price: 1140318,
    datetime: '31/03/24',
  },
  {
    buy_price: 1198204,
    sell_price: 1158703,
    datetime: '01/04/24',
  },
  {
    buy_price: 1206039,
    sell_price: 1166289,
    datetime: '02/04/24',
  },
  {
    buy_price: 1215430,
    sell_price: 1175382,
    datetime: '03/04/24',
  },
  {
    buy_price: 1220635,
    sell_price: 1180375,
    datetime: '04/04/24',
  },
  {
    buy_price: 1229133,
    sell_price: 1188640,
    datetime: '05/04/24',
  },
  {
    buy_price: 1231553,
    sell_price: 1190000,
    datetime: '06/04/24',
  },
  {
    buy_price: 1231535,
    sell_price: 1189981,
    datetime: '07/04/24',
  },
  {
    buy_price: 1240339,
    sell_price: 1199360,
    datetime: '08/04/24',
  },
  {
    buy_price: 1249646,
    sell_price: 1208458,
    datetime: '09/04/24',
  },
  {
    buy_price: 1248135,
    sell_price: 1206985,
    datetime: '10/04/24',
  },
  {
    buy_price: 1250448,
    sell_price: 1209222,
    datetime: '11/04/24',
  },
  {
    buy_price: 1303606,
    sell_price: 1260610,
    datetime: '12/04/24',
  },
  {
    buy_price: 1271411,
    sell_price: 1229475,
    datetime: '13/04/24',
  },
  {
    buy_price: 1256622,
    sell_price: 1214223,
    datetime: '14/04/24',
  },
  {
    buy_price: 1271491,
    sell_price: 1228831,
    datetime: '15/04/24',
  },
  {
    buy_price: 1300028,
    sell_price: 1257180,
    datetime: '16/04/24',
  },
  {
    buy_price: 1300053,
    sell_price: 1257204,
    datetime: '17/04/24',
  },
  {
    buy_price: 1288533,
    sell_price: 1246091,
    datetime: '18/04/24',
  },
  {
    buy_price: 1309934,
    sell_price: 1266630,
    datetime: '19/04/24',
  },
  {
    buy_price: 1294780,
    sell_price: 1252095,
    datetime: '20/04/24',
  },
  {
    buy_price: 1289728,
    sell_price: 1246845,
    datetime: '21/04/24',
  },
  {
    buy_price: 1289955,
    sell_price: 1247127,
    datetime: '22/04/24',
  },
  {
    buy_price: 1261322,
    sell_price: 1219716,
    datetime: '23/04/24',
  },
  {
    buy_price: 1259451,
    sell_price: 1217943,
    datetime: '24/04/24',
  },
  {
    buy_price: 1263424,
    sell_price: 1221781,
    datetime: '25/04/24',
  },
  {
    buy_price: 1270618,
    sell_price: 1228716,
    datetime: '26/04/24',
  },
  {
    buy_price: 1263257,
    sell_price: 1221604,
    datetime: '27/04/24',
  },
  {
    buy_price: 1262973,
    sell_price: 1220201,
    datetime: '28/04/24',
  },
  {
    buy_price: 1266095,
    sell_price: 1224380,
    datetime: '29/04/24',
  },
  {
    buy_price: 1265692,
    sell_price: 1223947,
    datetime: '30/04/24',
  },
  {
    buy_price: 1246330,
    sell_price: 1205295,
    datetime: '01/05/24',
  },
  {
    buy_price: 1256724,
    sell_price: 1215290,
    datetime: '02/05/24',
  },
  {
    buy_price: 1236789,
    sell_price: 1195934,
    datetime: '03/05/24',
  },
  {
    buy_price: 1223407,
    sell_price: 1183060,
    datetime: '04/05/24',
  },
  {
    buy_price: 1222478,
    sell_price: 1181325,
    datetime: '05/05/24',
  },
  {
    buy_price: 1242494,
    sell_price: 1201509,
    datetime: '06/05/24',
  },
  {
    buy_price: 1243102,
    sell_price: 1202103,
    datetime: '07/05/24',
  },
  {
    buy_price: 1241002,
    sell_price: 1200086,
    datetime: '08/05/24',
  },
  {
    buy_price: 1247667,
    sell_price: 1206528,
    datetime: '09/05/24',
  },
  {
    buy_price: 1267749,
    sell_price: 1225969,
    datetime: '10/05/24',
  },
  {
    buy_price: 1265496,
    sell_price: 1223754,
    datetime: '11/05/24',
  },
  {
    buy_price: 1260244,
    sell_price: 1217988,
    datetime: '12/05/24',
  },
  {
    buy_price: 1262187,
    sell_price: 1220508,
    datetime: '13/05/24',
  },
  {
    buy_price: 1261243,
    sell_price: 1219604,
    datetime: '14/05/24',
  },
  {
    buy_price: 1265033,
    sell_price: 1223308,
    datetime: '15/05/24',
  },
  {
    buy_price: 1269272,
    sell_price: 1227483,
    datetime: '16/05/24',
  },
  {
    buy_price: 1283005,
    sell_price: 1240694,
    datetime: '17/05/24',
  },
  {
    buy_price: 1284391,
    sell_price: 1241987,
    datetime: '18/05/24',
  },
  {
    buy_price: 1282043,
    sell_price: 1239039,
    datetime: '19/05/24',
  },
  {
    buy_price: 1300979,
    sell_price: 1258071,
    datetime: '20/05/24',
  },
  {
    buy_price: 1296780,
    sell_price: 1253993,
    datetime: '21/05/24',
  },
  {
    buy_price: 1290292,
    sell_price: 1247756,
    datetime: '22/05/24',
  },
  {
    buy_price: 1275660,
    sell_price: 1233610,
    datetime: '23/05/24',
  },
  {
    buy_price: 1252743,
    sell_price: 1211441,
    datetime: '24/05/24',
  },
  {
    buy_price: 1245457,
    sell_price: 1204269,
    datetime: '25/05/24',
  },
  {
    buy_price: 1245457,
    sell_price: 1203688,
    datetime: '26/05/24',
  },
  {
    buy_price: 1260141,
    sell_price: 1218581,
    datetime: '27/05/24',
  },
  {
    buy_price: 1264426,
    sell_price: 1222730,
    datetime: '28/05/24',
  },
  {
    buy_price: 1268647,
    sell_price: 1226775,
    datetime: '29/05/24',
  },
  {
    buy_price: 1267504,
    sell_price: 1225736,
    datetime: '30/05/24',
  },
  {
    buy_price: 1273660,
    sell_price: 1231648,
    datetime: '31/05/24',
  },
  {
    buy_price: 1261349,
    sell_price: 1219784,
    datetime: '01/06/24',
  },
  {
    buy_price: 1258031,
    sell_price: 1214919,
    datetime: '02/06/24',
  },
  {
    buy_price: 1265812,
    sell_price: 1224064,
    datetime: '03/06/24',
  },
  {
    buy_price: 1269486,
    sell_price: 1227632,
    datetime: '04/06/24',
  },
  {
    buy_price: 1278804,
    sell_price: 1236643,
    datetime: '05/06/24',
  },
  {
    buy_price: 1285200,
    sell_price: 1242846,
    datetime: '06/06/24',
  },
  {
    buy_price: 1287304,
    sell_price: 1244870,
    datetime: '07/06/24',
  },
  {
    buy_price: 1251094,
    sell_price: 1209809,
    datetime: '08/06/24',
  },
  {
    buy_price: 1241238,
    sell_price: 1200015,
    datetime: '09/06/24',
  },
  {
    buy_price: 1254076,
    sell_price: 1212724,
    datetime: '10/06/24',
  },
  {
    buy_price: 1256696,
    sell_price: 1215262,
    datetime: '11/06/24',
  },
  {
    buy_price: 1261666,
    sell_price: 1220074,
    datetime: '12/06/24',
  },
  {
    buy_price: 1259579,
    sell_price: 1218052,
    datetime: '13/06/24',
  },
  {
    buy_price: 1279822,
    sell_price: 1237638,
    datetime: '14/06/24',
  },
  {
    buy_price: 1279452,
    sell_price: 1237259,
    datetime: '15/06/24',
  },
  {
    buy_price: 1279174,
    sell_price: 1235919,
    datetime: '16/06/24',
  },
  {
    buy_price: 1279475,
    sell_price: 1236089,
    datetime: '17/06/24',
  },
  {
    buy_price: 1273265,
    sell_price: 1231238,
    datetime: '18/06/24',
  },
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

export const yearlyChart = {
  jsonapi: {
    version: '1.0',
  },
  data: {
    type: 'gold-price',
    attributes: {
      price: 357795,
      percentage: 33.94,
      movement: 'profit',
      prices: filterPricesRecords(yearlyPricesData, ['01', '10', '20', '30']),
      // prices: yearlyPricesData,
    },
  },
};
