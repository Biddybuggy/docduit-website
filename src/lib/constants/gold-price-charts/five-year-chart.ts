import { filterPricesRecords } from '@/lib/utils';

export const fiveYearPricesData = [
  {
    buy_price: 685488,
    sell_price: 665387,
    datetime: '19/12/19',
  },
  {
    buy_price: 686676,
    sell_price: 666541,
    datetime: '20/12/19',
  },
  {
    buy_price: 684004,
    sell_price: 663925,
    datetime: '21/12/19',
  },
  {
    buy_price: 684143,
    sell_price: 664037,
    datetime: '22/12/19',
  },
  {
    buy_price: 688086,
    sell_price: 667864,
    datetime: '23/12/19',
  },
  {
    buy_price: 694651,
    sell_price: 674239,
    datetime: '24/12/19',
  },
  {
    buy_price: 694717,
    sell_price: 674303,
    datetime: '25/12/19',
  },
  {
    buy_price: 705223,
    sell_price: 684504,
    datetime: '26/12/19',
  },
  {
    buy_price: 701670,
    sell_price: 681031,
    datetime: '27/12/19',
  },
  {
    buy_price: 700450,
    sell_price: 679869,
    datetime: '28/12/19',
  },
  {
    buy_price: 698442,
    sell_price: 677920,
    datetime: '29/12/19',
  },
  {
    buy_price: 700192,
    sell_price: 679618,
    datetime: '30/12/19',
  },
  {
    buy_price: 701241,
    sell_price: 680683,
    datetime: '31/12/19',
  },
  {
    buy_price: 702283,
    sell_price: 681648,
    datetime: '01/01/20',
  },
  {
    buy_price: 704072,
    sell_price: 683386,
    datetime: '02/01/20',
  },
  {
    buy_price: 716598,
    sell_price: 695547,
    datetime: '03/01/20',
  },
  {
    buy_price: 724687,
    sell_price: 703400,
    datetime: '04/01/20',
  },
  {
    buy_price: 715942,
    sell_price: 695586,
    datetime: '05/01/20',
  },
  {
    buy_price: 730328,
    sell_price: 709566,
    datetime: '06/01/20',
  },
  {
    buy_price: 724396,
    sell_price: 703118,
    datetime: '07/01/20',
  },
  {
    buy_price: 741290,
    sell_price: 719565,
    datetime: '08/01/20',
  },
  {
    buy_price: 718658,
    sell_price: 697547,
    datetime: '09/01/20',
  },
  {
    buy_price: 713753,
    sell_price: 692786,
    datetime: '10/01/20',
  },
  {
    buy_price: 714430,
    sell_price: 691430,
    datetime: '11/01/20',
  },
  {
    buy_price: 716308,
    sell_price: 693247,
    datetime: '12/01/20',
  },
  {
    buy_price: 713830,
    sell_price: 690849,
    datetime: '13/01/20',
  },
  {
    buy_price: 704859,
    sell_price: 682197,
    datetime: '14/01/20',
  },
  {
    buy_price: 708134,
    sell_price: 685336,
    datetime: '15/01/20',
  },
  {
    buy_price: 713019,
    sell_price: 690065,
    datetime: '16/01/20',
  },
  {
    buy_price: 708920,
    sell_price: 686097,
    datetime: '17/01/20',
  },
  {
    buy_price: 707796,
    sell_price: 685009,
    datetime: '18/01/20',
  },
  {
    buy_price: 705973,
    sell_price: 683245,
    datetime: '19/01/20',
  },
  {
    buy_price: 707978,
    sell_price: 685230,
    datetime: '20/01/20',
  },
  {
    buy_price: 709681,
    sell_price: 686943,
    datetime: '21/01/20',
  },
  {
    buy_price: 707808,
    sell_price: 685130,
    datetime: '22/01/20',
  },
  {
    buy_price: 709643,
    sell_price: 686731,
    datetime: '23/01/20',
  },
  {
    buy_price: 709703,
    sell_price: 686834,
    datetime: '24/01/20',
  },
  {
    buy_price: 710298,
    sell_price: 687366,
    datetime: '25/01/20',
  },
  {
    buy_price: 708339,
    sell_price: 685492,
    datetime: '26/01/20',
  },
  {
    buy_price: 721287,
    sell_price: 698002,
    datetime: '27/01/20',
  },
  {
    buy_price: 718725,
    sell_price: 695522,
    datetime: '28/01/20',
  },
  {
    buy_price: 711751,
    sell_price: 688816,
    datetime: '29/01/20',
  },
  {
    buy_price: 718824,
    sell_price: 695618,
    datetime: '30/01/20',
  },
  {
    buy_price: 723586,
    sell_price: 698562,
    datetime: '31/01/20',
  },
  {
    buy_price: 723944,
    sell_price: 698460,
    datetime: '01/02/20',
  },
  {
    buy_price: 723560,
    sell_price: 698046,
    datetime: '02/02/20',
  },
  {
    buy_price: 717621,
    sell_price: 696639,
    datetime: '03/02/20',
  },
  {
    buy_price: 716764,
    sell_price: 694299,
    datetime: '04/02/20',
  },
  {
    buy_price: 709476,
    sell_price: 685858,
    datetime: '05/02/20',
  },
  {
    buy_price: 707680,
    sell_price: 684166,
    datetime: '06/02/20',
  },
  {
    buy_price: 716687,
    sell_price: 695638,
    datetime: '07/02/20',
  },
  {
    buy_price: 715350,
    sell_price: 694317,
    datetime: '08/02/20',
  },
  {
    buy_price: 710906,
    sell_price: 690004,
    datetime: '09/02/20',
  },
  {
    buy_price: 716412,
    sell_price: 695349,
    datetime: '10/02/20',
  },
  {
    buy_price: 715738,
    sell_price: 694784,
    datetime: '11/02/20',
  },
  {
    buy_price: 712519,
    sell_price: 690794,
    datetime: '12/02/20',
  },
  {
    buy_price: 717481,
    sell_price: 696510,
    datetime: '13/02/20',
  },
  {
    buy_price: 718122,
    sell_price: 697119,
    datetime: '14/02/20',
  },
  {
    buy_price: 718749,
    sell_price: 697693,
    datetime: '15/02/20',
  },
  {
    buy_price: 718746,
    sell_price: 697034,
    datetime: '16/02/20',
  },
  {
    buy_price: 717923,
    sell_price: 696316,
    datetime: '17/02/20',
  },
  {
    buy_price: 728657,
    sell_price: 707360,
    datetime: '18/02/20',
  },
  {
    buy_price: 730985,
    sell_price: 709639,
    datetime: '19/02/20',
  },
  {
    buy_price: 740254,
    sell_price: 718543,
    datetime: '20/02/20',
  },
  {
    buy_price: 746989,
    sell_price: 724975,
    datetime: '21/02/20',
  },
  {
    buy_price: 747122,
    sell_price: 725113,
    datetime: '22/02/20',
  },
  {
    buy_price: 742995,
    sell_price: 720462,
    datetime: '23/02/20',
  },
  {
    buy_price: 771246,
    sell_price: 748514,
    datetime: '24/02/20',
  },
  {
    buy_price: 767771,
    sell_price: 745145,
    datetime: '25/02/20',
  },
  {
    buy_price: 761471,
    sell_price: 739003,
    datetime: '26/02/20',
  },
  {
    buy_price: 770376,
    sell_price: 747664,
    datetime: '27/02/20',
  },
  {
    buy_price: 777300,
    sell_price: 754374,
    datetime: '28/02/20',
  },
  {
    buy_price: 749317,
    sell_price: 727219,
    datetime: '29/02/20',
  },
  {
    buy_price: 745041,
    sell_price: 722672,
    datetime: '01/03/20',
  },
  {
    buy_price: 769076,
    sell_price: 748579,
    datetime: '02/03/20',
  },
  {
    buy_price: 767353,
    sell_price: 744925,
    datetime: '03/03/20',
  },
  {
    buy_price: 779516,
    sell_price: 756734,
    datetime: '04/03/20',
  },
  {
    buy_price: 784578,
    sell_price: 759266,
    datetime: '05/03/20',
  },
  {
    buy_price: 801086,
    sell_price: 775237,
    datetime: '06/03/20',
  },
  {
    buy_price: 797249,
    sell_price: 771502,
    datetime: '07/03/20',
  },
  {
    buy_price: 788376,
    sell_price: 762135,
    datetime: '08/03/20',
  },
  {
    buy_price: 821566,
    sell_price: 794823,
    datetime: '09/03/20',
  },
  {
    buy_price: 808346,
    sell_price: 783349,
    datetime: '10/03/20',
  },
  {
    buy_price: 788168,
    sell_price: 764876,
    datetime: '11/03/20',
  },
  {
    buy_price: 790093,
    sell_price: 762779,
    datetime: '12/03/20',
  },
  {
    buy_price: 776119,
    sell_price: 753176,
    datetime: '13/03/20',
  },
  {
    buy_price: 738947,
    sell_price: 715611,
    datetime: '14/03/20',
  },
  {
    buy_price: 741243,
    sell_price: 717835,
    datetime: '15/03/20',
  },
  {
    buy_price: 766269,
    sell_price: 742934,
    datetime: '16/03/20',
  },
  {
    buy_price: 775072,
    sell_price: 750783,
    datetime: '17/03/20',
  },
  {
    buy_price: 773526,
    sell_price: 748814,
    datetime: '18/03/20',
  },
  {
    buy_price: 784965,
    sell_price: 759979,
    datetime: '19/03/20',
  },
  {
    buy_price: 800156,
    sell_price: 774692,
    datetime: '20/03/20',
  },
  {
    buy_price: 801815,
    sell_price: 775783,
    datetime: '21/03/20',
  },
  {
    buy_price: 804388,
    sell_price: 780038,
    datetime: '22/03/20',
  },
  {
    buy_price: 845820,
    sell_price: 820922,
    datetime: '23/03/20',
  },
  {
    buy_price: 869397,
    sell_price: 839418,
    datetime: '24/03/20',
  },
  {
    buy_price: 884952,
    sell_price: 841243,
    datetime: '25/03/20',
  },
  {
    buy_price: 868933,
    sell_price: 832297,
    datetime: '26/03/20',
  },
  {
    buy_price: 864644,
    sell_price: 829183,
    datetime: '27/03/20',
  },
  {
    buy_price: 863014,
    sell_price: 828118,
    datetime: '28/03/20',
  },
  {
    buy_price: 860560,
    sell_price: 822783,
    datetime: '29/03/20',
  },
  {
    buy_price: 862976,
    sell_price: 825134,
    datetime: '30/03/20',
  },
  {
    buy_price: 861344,
    sell_price: 820288,
    datetime: '31/03/20',
  },
  {
    buy_price: 912222,
    sell_price: 869098,
    datetime: '01/04/20',
  },
  {
    buy_price: 882975,
    sell_price: 841348,
    datetime: '02/04/20',
  },
  {
    buy_price: 881947,
    sell_price: 838590,
    datetime: '03/04/20',
  },
  {
    buy_price: 877326,
    sell_price: 834004,
    datetime: '04/04/20',
  },
  {
    buy_price: 862089,
    sell_price: 817611,
    datetime: '05/04/20',
  },
  {
    buy_price: 883386,
    sell_price: 839974,
    datetime: '06/04/20',
  },
  {
    buy_price: 900671,
    sell_price: 855240,
    datetime: '07/04/20',
  },
  {
    buy_price: 890343,
    sell_price: 846433,
    datetime: '08/04/20',
  },
  {
    buy_price: 887850,
    sell_price: 840294,
    datetime: '09/04/20',
  },
  {
    buy_price: 896294,
    sell_price: 846710,
    datetime: '10/04/20',
  },
  {
    buy_price: 898445,
    sell_price: 848743,
    datetime: '11/04/20',
  },
  {
    buy_price: 895950,
    sell_price: 846386,
    datetime: '12/04/20',
  },
  {
    buy_price: 909594,
    sell_price: 860476,
    datetime: '13/04/20',
  },
  {
    buy_price: 918797,
    sell_price: 868592,
    datetime: '14/04/20',
  },
  {
    buy_price: 904130,
    sell_price: 850781,
    datetime: '15/04/20',
  },
  {
    buy_price: 908218,
    sell_price: 855017,
    datetime: '16/04/20',
  },
  {
    buy_price: 904969,
    sell_price: 850091,
    datetime: '17/04/20',
  },
  {
    buy_price: 873320,
    sell_price: 820269,
    datetime: '18/04/20',
  },
  {
    buy_price: 865940,
    sell_price: 809152,
    datetime: '19/04/20',
  },
  {
    buy_price: 876183,
    sell_price: 823877,
    datetime: '20/04/20',
  },
  {
    buy_price: 883691,
    sell_price: 829637,
    datetime: '21/04/20',
  },
  {
    buy_price: 891470,
    sell_price: 843654,
    datetime: '22/04/20',
  },
  {
    buy_price: 898196,
    sell_price: 846001,
    datetime: '23/04/20',
  },
  {
    buy_price: 907869,
    sell_price: 854401,
    datetime: '24/04/20',
  },
  {
    buy_price: 893866,
    sell_price: 841504,
    datetime: '25/04/20',
  },
  {
    buy_price: 892290,
    sell_price: 864260,
    datetime: '26/04/20',
  },
  {
    buy_price: 891086,
    sell_price: 865702,
    datetime: '27/04/20',
  },
  {
    buy_price: 889949,
    sell_price: 861993,
    datetime: '28/04/20',
  },
  {
    buy_price: 881987,
    sell_price: 853797,
    datetime: '29/04/20',
  },
  {
    buy_price: 866151,
    sell_price: 838548,
    datetime: '30/04/20',
  },
  {
    buy_price: 864167,
    sell_price: 836276,
    datetime: '01/05/20',
  },
  {
    buy_price: 860387,
    sell_price: 832494,
    datetime: '02/05/20',
  },
  {
    buy_price: 839171,
    sell_price: 809833,
    datetime: '03/05/20',
  },
  {
    buy_price: 872611,
    sell_price: 840950,
    datetime: '04/05/20',
  },
  {
    buy_price: 878787,
    sell_price: 836302,
    datetime: '05/05/20',
  },
  {
    buy_price: 872526,
    sell_price: 836336,
    datetime: '06/05/20',
  },
  {
    buy_price: 867842,
    sell_price: 834052,
    datetime: '07/05/20',
  },
  {
    buy_price: 869908,
    sell_price: 835112,
    datetime: '08/05/20',
  },
  {
    buy_price: 849052,
    sell_price: 815938,
    datetime: '09/05/20',
  },
  {
    buy_price: 851178,
    sell_price: 815774,
    datetime: '10/05/20',
  },
  {
    buy_price: 849916,
    sell_price: 816684,
    datetime: '11/05/20',
  },
  {
    buy_price: 855190,
    sell_price: 819943,
    datetime: '12/05/20',
  },
  {
    buy_price: 851690,
    sell_price: 817813,
    datetime: '13/05/20',
  },
  {
    buy_price: 863120,
    sell_price: 828660,
    datetime: '14/05/20',
  },
  {
    buy_price: 867114,
    sell_price: 832505,
    datetime: '15/05/20',
  },
  {
    buy_price: 866487,
    sell_price: 831434,
    datetime: '16/05/20',
  },
  {
    buy_price: 864103,
    sell_price: 828373,
    datetime: '17/05/20',
  },
  {
    buy_price: 874807,
    sell_price: 840026,
    datetime: '18/05/20',
  },
  {
    buy_price: 857757,
    sell_price: 823659,
    datetime: '19/05/20',
  },
  {
    buy_price: 860598,
    sell_price: 826246,
    datetime: '20/05/20',
  },
  {
    buy_price: 859525,
    sell_price: 825164,
    datetime: '21/05/20',
  },
  {
    buy_price: 862436,
    sell_price: 828233,
    datetime: '22/05/20',
  },
  {
    buy_price: 860460,
    sell_price: 826293,
    datetime: '23/05/20',
  },
  {
    buy_price: 854957,
    sell_price: 819057,
    datetime: '24/05/20',
  },
  {
    buy_price: 856264,
    sell_price: 822215,
    datetime: '25/05/20',
  },
  {
    buy_price: 863690,
    sell_price: 828561,
    datetime: '26/05/20',
  },
  {
    buy_price: 846349,
    sell_price: 812580,
    datetime: '27/05/20',
  },
  {
    buy_price: 848705,
    sell_price: 814904,
    datetime: '28/05/20',
  },
  {
    buy_price: 849234,
    sell_price: 815412,
    datetime: '29/05/20',
  },
  {
    buy_price: 849062,
    sell_price: 815169,
    datetime: '30/05/20',
  },
  {
    buy_price: 847863,
    sell_price: 813433,
    datetime: '31/05/20',
  },
  {
    buy_price: 847688,
    sell_price: 813710,
    datetime: '01/06/20',
  },
  {
    buy_price: 845971,
    sell_price: 812299,
    datetime: '02/06/20',
  },
  {
    buy_price: 827756,
    sell_price: 794749,
    datetime: '03/06/20',
  },
  {
    buy_price: 811188,
    sell_price: 776555,
    datetime: '04/06/20',
  },
  {
    buy_price: 812436,
    sell_price: 777329,
    datetime: '05/06/20',
  },
  {
    buy_price: 788741,
    sell_price: 753705,
    datetime: '06/06/20',
  },
  {
    buy_price: 788741,
    sell_price: 751961,
    datetime: '07/06/20',
  },
  {
    buy_price: 805046,
    sell_price: 767720,
    datetime: '08/06/20',
  },
  {
    buy_price: 809576,
    sell_price: 774394,
    datetime: '09/06/20',
  },
  {
    buy_price: 816152,
    sell_price: 780526,
    datetime: '10/06/20',
  },
  {
    buy_price: 828594,
    sell_price: 792532,
    datetime: '11/06/20',
  },
  {
    buy_price: 835969,
    sell_price: 799451,
    datetime: '12/06/20',
  },
  {
    buy_price: 822860,
    sell_price: 787024,
    datetime: '13/06/20',
  },
  {
    buy_price: 820928,
    sell_price: 783703,
    datetime: '14/06/20',
  },
  {
    buy_price: 825570,
    sell_price: 793605,
    datetime: '15/06/20',
  },
  {
    buy_price: 827391,
    sell_price: 795135,
    datetime: '16/06/20',
  },
  {
    buy_price: 822623,
    sell_price: 790666,
    datetime: '17/06/20',
  },
  {
    buy_price: 826782,
    sell_price: 793833,
    datetime: '18/06/20',
  },
  {
    buy_price: 828207,
    sell_price: 796141,
    datetime: '19/06/20',
  },
  {
    buy_price: 828712,
    sell_price: 796658,
    datetime: '20/06/20',
  },
  {
    buy_price: 828768,
    sell_price: 795594,
    datetime: '21/06/20',
  },
  {
    buy_price: 836867,
    sell_price: 804471,
    datetime: '22/06/20',
  },
  {
    buy_price: 837965,
    sell_price: 805444,
    datetime: '23/06/20',
  },
  {
    buy_price: 843147,
    sell_price: 809014,
    datetime: '24/06/20',
  },
  {
    buy_price: 842011,
    sell_price: 809376,
    datetime: '25/06/20',
  },
  {
    buy_price: 846931,
    sell_price: 814031,
    datetime: '26/06/20',
  },
  {
    buy_price: 848105,
    sell_price: 814903,
    datetime: '27/06/20',
  },
  {
    buy_price: 848081,
    sell_price: 813895,
    datetime: '28/06/20',
  },
  {
    buy_price: 864229,
    sell_price: 830827,
    datetime: '29/06/20',
  },
  {
    buy_price: 860991,
    sell_price: 828800,
    datetime: '30/06/20',
  },
  {
    buy_price: 867564,
    sell_price: 834988,
    datetime: '01/07/20',
  },
  {
    buy_price: 859462,
    sell_price: 826354,
    datetime: '02/07/20',
  },
  {
    buy_price: 863582,
    sell_price: 831171,
    datetime: '03/07/20',
  },
  {
    buy_price: 857585,
    sell_price: 823957,
    datetime: '04/07/20',
  },
  {
    buy_price: 859816,
    sell_price: 826100,
    datetime: '05/07/20',
  },
  {
    buy_price: 860423,
    sell_price: 828359,
    datetime: '06/07/20',
  },
  {
    buy_price: 861536,
    sell_price: 829281,
    datetime: '07/07/20',
  },
  {
    buy_price: 876671,
    sell_price: 843881,
    datetime: '08/07/20',
  },
  {
    buy_price: 872413,
    sell_price: 839695,
    datetime: '09/07/20',
  },
  {
    buy_price: 873258,
    sell_price: 839371,
    datetime: '10/07/20',
  },
  {
    buy_price: 864034,
    sell_price: 831826,
    datetime: '11/07/20',
  },
  {
    buy_price: 866836,
    sell_price: 833592,
    datetime: '12/07/20',
  },
  {
    buy_price: 872195,
    sell_price: 839655,
    datetime: '13/07/20',
  },
  {
    buy_price: 876467,
    sell_price: 843704,
    datetime: '14/07/20',
  },
  {
    buy_price: 886260,
    sell_price: 852033,
    datetime: '15/07/20',
  },
  {
    buy_price: 887620,
    sell_price: 854524,
    datetime: '16/07/20',
  },
  {
    buy_price: 895860,
    sell_price: 862448,
    datetime: '17/07/20',
  },
  {
    buy_price: 890661,
    sell_price: 857519,
    datetime: '18/07/20',
  },
  {
    buy_price: 890266,
    sell_price: 855714,
    datetime: '19/07/20',
  },
  {
    buy_price: 902713,
    sell_price: 869055,
    datetime: '20/07/20',
  },
  {
    buy_price: 903177,
    sell_price: 869468,
    datetime: '21/07/20',
  },
  {
    buy_price: 911459,
    sell_price: 877407,
    datetime: '22/07/20',
  },
  {
    buy_price: 924145,
    sell_price: 889593,
    datetime: '23/07/20',
  },
  {
    buy_price: 925232,
    sell_price: 890659,
    datetime: '24/07/20',
  },
  {
    buy_price: 922398,
    sell_price: 887972,
    datetime: '25/07/20',
  },
  {
    buy_price: 915990,
    sell_price: 879621,
    datetime: '26/07/20',
  },
  {
    buy_price: 936168,
    sell_price: 900971,
    datetime: '27/07/20',
  },
  {
    buy_price: 949291,
    sell_price: 913473,
    datetime: '28/07/20',
  },
  {
    buy_price: 950269,
    sell_price: 914534,
    datetime: '29/07/20',
  },
  {
    buy_price: 956276,
    sell_price: 918405,
    datetime: '30/07/20',
  },
  {
    buy_price: 958391,
    sell_price: 922271,
    datetime: '31/07/20',
  },
  {
    buy_price: 957605,
    sell_price: 920882,
    datetime: '01/08/20',
  },
  {
    buy_price: 957533,
    sell_price: 919182,
    datetime: '02/08/20',
  },
  {
    buy_price: 963786,
    sell_price: 922646,
    datetime: '03/08/20',
  },
  {
    buy_price: 971824,
    sell_price: 933367,
    datetime: '04/08/20',
  },
  {
    buy_price: 990873,
    sell_price: 951603,
    datetime: '05/08/20',
  },
  {
    buy_price: 1000648,
    sell_price: 961083,
    datetime: '06/08/20',
  },
  {
    buy_price: 1004818,
    sell_price: 964980,
    datetime: '07/08/20',
  },
  {
    buy_price: 992701,
    sell_price: 953453,
    datetime: '08/08/20',
  },
  {
    buy_price: 992037,
    sell_price: 952156,
    datetime: '09/08/20',
  },
  {
    buy_price: 999863,
    sell_price: 960299,
    datetime: '10/08/20',
  },
  {
    buy_price: 997005,
    sell_price: 957591,
    datetime: '11/08/20',
  },
  {
    buy_price: 955267,
    sell_price: 917385,
    datetime: '12/08/20',
  },
  {
    buy_price: 960864,
    sell_price: 922879,
    datetime: '13/08/20',
  },
  {
    buy_price: 970989,
    sell_price: 932514,
    datetime: '14/08/20',
  },
  {
    buy_price: 961843,
    sell_price: 923800,
    datetime: '15/08/20',
  },
  {
    buy_price: 961080,
    sell_price: 921867,
    datetime: '16/08/20',
  },
  {
    buy_price: 979746,
    sell_price: 941003,
    datetime: '17/08/20',
  },
  {
    buy_price: 988092,
    sell_price: 948973,
    datetime: '18/08/20',
  },
  {
    buy_price: 986228,
    sell_price: 947097,
    datetime: '19/08/20',
  },
  {
    buy_price: 960303,
    sell_price: 922318,
    datetime: '20/08/20',
  },
  {
    buy_price: 954919,
    sell_price: 917115,
    datetime: '21/08/20',
  },
  {
    buy_price: 950863,
    sell_price: 913263,
    datetime: '22/08/20',
  },
  {
    buy_price: 951902,
    sell_price: 911896,
    datetime: '23/08/20',
  },
  {
    buy_price: 951282,
    sell_price: 912445,
    datetime: '24/08/20',
  },
  {
    buy_price: 941557,
    sell_price: 904152,
    datetime: '25/08/20',
  },
  {
    buy_price: 944646,
    sell_price: 907238,
    datetime: '26/08/20',
  },
  {
    buy_price: 960985,
    sell_price: 922988,
    datetime: '27/08/20',
  },
  {
    buy_price: 950835,
    sell_price: 913267,
    datetime: '28/08/20',
  },
  {
    buy_price: 949678,
    sell_price: 912174,
    datetime: '29/08/20',
  },
  {
    buy_price: 957571,
    sell_price: 918338,
    datetime: '30/08/20',
  },
  {
    buy_price: 956829,
    sell_price: 918973,
    datetime: '31/08/20',
  },
  {
    buy_price: 969188,
    sell_price: 930844,
    datetime: '01/09/20',
  },
  {
    buy_price: 968640,
    sell_price: 930348,
    datetime: '02/09/20',
  },
  {
    buy_price: 960162,
    sell_price: 922172,
    datetime: '03/09/20',
  },
  {
    buy_price: 952521,
    sell_price: 914063,
    datetime: '04/09/20',
  },
  {
    buy_price: 946348,
    sell_price: 908890,
    datetime: '05/09/20',
  },
  {
    buy_price: 948193,
    sell_price: 909165,
    datetime: '06/09/20',
  },
  {
    buy_price: 948054,
    sell_price: 910546,
    datetime: '07/09/20',
  },
  {
    buy_price: 953485,
    sell_price: 915739,
    datetime: '08/09/20',
  },
  {
    buy_price: 956635,
    sell_price: 918817,
    datetime: '09/09/20',
  },
  {
    buy_price: 973456,
    sell_price: 934936,
    datetime: '10/09/20',
  },
  {
    buy_price: 976118,
    sell_price: 937424,
    datetime: '11/09/20',
  },
  {
    buy_price: 966121,
    sell_price: 927938,
    datetime: '12/09/20',
  },
  {
    buy_price: 964408,
    sell_price: 925791,
    datetime: '13/09/20',
  },
  {
    buy_price: 968598,
    sell_price: 930322,
    datetime: '14/09/20',
  },
  {
    buy_price: 972776,
    sell_price: 934359,
    datetime: '15/09/20',
  },
  {
    buy_price: 968760,
    sell_price: 930446,
    datetime: '16/09/20',
  },
  {
    buy_price: 965446,
    sell_price: 927112,
    datetime: '17/09/20',
  },
  {
    buy_price: 958573,
    sell_price: 920659,
    datetime: '18/09/20',
  },
  {
    buy_price: 959282,
    sell_price: 921298,
    datetime: '19/09/20',
  },
  {
    buy_price: 958723,
    sell_price: 919101,
    datetime: '20/09/20',
  },
  {
    buy_price: 958723,
    sell_price: 919101,
    datetime: '21/09/20',
  },
  {
    buy_price: 943483,
    sell_price: 906155,
    datetime: '22/09/20',
  },
  {
    buy_price: 936613,
    sell_price: 899589,
    datetime: '23/09/20',
  },
  {
    buy_price: 928658,
    sell_price: 891956,
    datetime: '24/09/20',
  },
  {
    buy_price: 930950,
    sell_price: 894104,
    datetime: '25/09/20',
  },
  {
    buy_price: 925790,
    sell_price: 889207,
    datetime: '26/09/20',
  },
  {
    buy_price: 921232,
    sell_price: 884325,
    datetime: '27/09/20',
  },
  {
    buy_price: 926082,
    sell_price: 889473,
    datetime: '28/09/20',
  },
  {
    buy_price: 934155,
    sell_price: 897227,
    datetime: '29/09/20',
  },
  {
    buy_price: 940112,
    sell_price: 902960,
    datetime: '30/09/20',
  },
  {
    buy_price: 940354,
    sell_price: 903197,
    datetime: '01/10/20',
  },
  {
    buy_price: 947256,
    sell_price: 909827,
    datetime: '02/10/20',
  },
  {
    buy_price: 939774,
    sell_price: 902639,
    datetime: '03/10/20',
  },
  {
    buy_price: 936435,
    sell_price: 898165,
    datetime: '04/10/20',
  },
  {
    buy_price: 936915,
    sell_price: 899856,
    datetime: '05/10/20',
  },
  {
    buy_price: 939322,
    sell_price: 901687,
    datetime: '06/10/20',
  },
  {
    buy_price: 929793,
    sell_price: 893039,
    datetime: '07/10/20',
  },
  {
    buy_price: 928598,
    sell_price: 891948,
    datetime: '08/10/20',
  },
  {
    buy_price: 936595,
    sell_price: 899578,
    datetime: '09/10/20',
  },
  {
    buy_price: 939779,
    sell_price: 901787,
    datetime: '10/10/20',
  },
  {
    buy_price: 939779,
    sell_price: 900716,
    datetime: '11/10/20',
  },
  {
    buy_price: 941339,
    sell_price: 904144,
    datetime: '12/10/20',
  },
  {
    buy_price: 942487,
    sell_price: 905250,
    datetime: '13/10/20',
  },
  {
    buy_price: 932010,
    sell_price: 895183,
    datetime: '14/10/20',
  },
  {
    buy_price: 932332,
    sell_price: 895510,
    datetime: '15/10/20',
  },
  {
    buy_price: 934912,
    sell_price: 897970,
    datetime: '16/10/20',
  },
  {
    buy_price: 930051,
    sell_price: 893301,
    datetime: '17/10/20',
  },
  {
    buy_price: 929017,
    sell_price: 891805,
    datetime: '18/10/20',
  },
  {
    buy_price: 934949,
    sell_price: 897963,
    datetime: '19/10/20',
  },
  {
    buy_price: 931793,
    sell_price: 894988,
    datetime: '20/10/20',
  },
  {
    buy_price: 936720,
    sell_price: 899689,
    datetime: '21/10/20',
  },
  {
    buy_price: 936794,
    sell_price: 899839,
    datetime: '22/10/20',
  },
  {
    buy_price: 932319,
    sell_price: 895451,
    datetime: '23/10/20',
  },
  {
    buy_price: 927281,
    sell_price: 890626,
    datetime: '24/10/20',
  },
  {
    buy_price: 929320,
    sell_price: 891233,
    datetime: '25/10/20',
  },
  {
    buy_price: 928831,
    sell_price: 892156,
    datetime: '26/10/20',
  },
  {
    buy_price: 929536,
    sell_price: 892828,
    datetime: '27/10/20',
  },
  {
    buy_price: 931349,
    sell_price: 893578,
    datetime: '28/10/20',
  },
  {
    buy_price: 923337,
    sell_price: 886794,
    datetime: '29/10/20',
  },
  {
    buy_price: 922855,
    sell_price: 886392,
    datetime: '30/10/20',
  },
  {
    buy_price: 923184,
    sell_price: 886709,
    datetime: '31/10/20',
  },
  {
    buy_price: 916085,
    sell_price: 870854,
    datetime: '01/11/20',
  },
  {
    buy_price: 919057,
    sell_price: 882768,
    datetime: '02/11/20',
  },
  {
    buy_price: 921388,
    sell_price: 884965,
    datetime: '03/11/20',
  },
  {
    buy_price: 923142,
    sell_price: 886596,
    datetime: '04/11/20',
  },
  {
    buy_price: 924660,
    sell_price: 888116,
    datetime: '05/11/20',
  },
  {
    buy_price: 929073,
    sell_price: 891907,
    datetime: '06/11/20',
  },
  {
    buy_price: 923082,
    sell_price: 886619,
    datetime: '07/11/20',
  },
  {
    buy_price: 922081,
    sell_price: 881972,
    datetime: '08/11/20',
  },
  {
    buy_price: 922605,
    sell_price: 886202,
    datetime: '09/11/20',
  },
  {
    buy_price: 888142,
    sell_price: 852743,
    datetime: '10/11/20',
  },
  {
    buy_price: 887990,
    sell_price: 852642,
    datetime: '11/11/20',
  },
  {
    buy_price: 885759,
    sell_price: 850469,
    datetime: '12/11/20',
  },
  {
    buy_price: 894950,
    sell_price: 859267,
    datetime: '13/11/20',
  },
  {
    buy_price: 891735,
    sell_price: 856238,
    datetime: '14/11/20',
  },
  {
    buy_price: 888761,
    sell_price: 851962,
    datetime: '15/11/20',
  },
  {
    buy_price: 891345,
    sell_price: 855819,
    datetime: '16/11/20',
  },
  {
    buy_price: 886812,
    sell_price: 851917,
    datetime: '17/11/20',
  },
  {
    buy_price: 883865,
    sell_price: 849095,
    datetime: '18/11/20',
  },
  {
    buy_price: 882687,
    sell_price: 847789,
    datetime: '19/11/20',
  },
  {
    buy_price: 889874,
    sell_price: 852807,
    datetime: '20/11/20',
  },
  {
    buy_price: 887504,
    sell_price: 850502,
    datetime: '21/11/20',
  },
  {
    buy_price: 885412,
    sell_price: 846088,
    datetime: '22/11/20',
  },
  {
    buy_price: 885412,
    sell_price: 849207,
    datetime: '23/11/20',
  },
  {
    buy_price: 872393,
    sell_price: 836755,
    datetime: '24/11/20',
  },
  {
    buy_price: 856564,
    sell_price: 822528,
    datetime: '25/11/20',
  },
  {
    buy_price: 855575,
    sell_price: 821587,
    datetime: '26/11/20',
  },
  {
    buy_price: 855113,
    sell_price: 821189,
    datetime: '27/11/20',
  },
  {
    buy_price: 841462,
    sell_price: 806082,
    datetime: '28/11/20',
  },
  {
    buy_price: 841640,
    sell_price: 805847,
    datetime: '29/11/20',
  },
  {
    buy_price: 841388,
    sell_price: 807984,
    datetime: '30/11/20',
  },
  {
    buy_price: 857308,
    sell_price: 823264,
    datetime: '01/12/20',
  },
  {
    buy_price: 866079,
    sell_price: 831584,
    datetime: '02/12/20',
  },
  {
    buy_price: 871891,
    sell_price: 837256,
    datetime: '03/12/20',
  },
  {
    buy_price: 870884,
    sell_price: 835502,
    datetime: '04/12/20',
  },
  {
    buy_price: 866013,
    sell_price: 829784,
    datetime: '05/12/20',
  },
  {
    buy_price: 865884,
    sell_price: 829082,
    datetime: '06/12/20',
  },
  {
    buy_price: 879861,
    sell_price: 844924,
    datetime: '07/12/20',
  },
  {
    buy_price: 882825,
    sell_price: 847771,
    datetime: '08/12/20',
  },
  {
    buy_price: 882759,
    sell_price: 847653,
    datetime: '09/12/20',
  },
  {
    buy_price: 869708,
    sell_price: 835155,
    datetime: '10/12/20',
  },
  {
    buy_price: 870961,
    sell_price: 834675,
    datetime: '11/12/20',
  },
  {
    buy_price: 869039,
    sell_price: 832852,
    datetime: '12/12/20',
  },
  {
    buy_price: 866869,
    sell_price: 829169,
    datetime: '13/12/20',
  },
  {
    buy_price: 866917,
    sell_price: 832461,
    datetime: '14/12/20',
  },
  {
    buy_price: 874811,
    sell_price: 840084,
    datetime: '15/12/20',
  },
  {
    buy_price: 878084,
    sell_price: 843227,
    datetime: '16/12/20',
  },
  {
    buy_price: 890933,
    sell_price: 855552,
    datetime: '17/12/20',
  },
  {
    buy_price: 889821,
    sell_price: 854481,
    datetime: '18/12/20',
  },
  {
    buy_price: 886623,
    sell_price: 851400,
    datetime: '19/12/20',
  },
  {
    buy_price: 886194,
    sell_price: 848631,
    datetime: '20/12/20',
  },
  {
    buy_price: 900379,
    sell_price: 864611,
    datetime: '21/12/20',
  },
  {
    buy_price: 895264,
    sell_price: 859689,
    datetime: '22/12/20',
  },
  {
    buy_price: 891129,
    sell_price: 855732,
    datetime: '23/12/20',
  },
  {
    buy_price: 891507,
    sell_price: 856095,
    datetime: '24/12/20',
  },
  {
    buy_price: 890877,
    sell_price: 854635,
    datetime: '25/12/20',
  },
  {
    buy_price: 890877,
    sell_price: 854635,
    datetime: '26/12/20',
  },
  {
    buy_price: 889301,
    sell_price: 853123,
    datetime: '27/12/20',
  },
  {
    buy_price: 897674,
    sell_price: 861990,
    datetime: '28/12/20',
  },
  {
    buy_price: 887219,
    sell_price: 851937,
    datetime: '29/12/20',
  },
  {
    buy_price: 885638,
    sell_price: 850407,
    datetime: '30/12/20',
  },
  {
    buy_price: 887491,
    sell_price: 851898,
    datetime: '31/12/20',
  },
  {
    buy_price: 898699,
    sell_price: 861243,
    datetime: '01/01/21',
  },
  {
    buy_price: 898136,
    sell_price: 860703,
    datetime: '02/01/21',
  },
  {
    buy_price: 898104,
    sell_price: 860673,
    datetime: '03/01/21',
  },
  {
    buy_price: 905642,
    sell_price: 869580,
    datetime: '04/01/21',
  },
  {
    buy_price: 907468,
    sell_price: 871410,
    datetime: '05/01/21',
  },
  {
    buy_price: 908288,
    sell_price: 872177,
    datetime: '06/01/21',
  },
  {
    buy_price: 902560,
    sell_price: 866724,
    datetime: '07/01/21',
  },
  {
    buy_price: 903872,
    sell_price: 867980,
    datetime: '08/01/21',
  },
  {
    buy_price: 873332,
    sell_price: 838631,
    datetime: '09/01/21',
  },
  {
    buy_price: 870337,
    sell_price: 834924,
    datetime: '10/01/21',
  },
  {
    buy_price: 878767,
    sell_price: 843864,
    datetime: '11/01/21',
  },
  {
    buy_price: 879109,
    sell_price: 844174,
    datetime: '12/01/21',
  },
  {
    buy_price: 877099,
    sell_price: 842245,
    datetime: '13/01/21',
  },
  {
    buy_price: 872456,
    sell_price: 837785,
    datetime: '14/01/21',
  },
  {
    buy_price: 868721,
    sell_price: 834202,
    datetime: '15/01/21',
  },
  {
    buy_price: 862214,
    sell_price: 826705,
    datetime: '16/01/21',
  },
  {
    buy_price: 862081,
    sell_price: 826578,
    datetime: '17/01/21',
  },
  {
    buy_price: 864966,
    sell_price: 830606,
    datetime: '18/01/21',
  },
  {
    buy_price: 868269,
    sell_price: 833774,
    datetime: '19/01/21',
  },
  {
    buy_price: 873316,
    sell_price: 838639,
    datetime: '20/01/21',
  },
  {
    buy_price: 875790,
    sell_price: 840942,
    datetime: '21/01/21',
  },
  {
    buy_price: 875884,
    sell_price: 841024,
    datetime: '22/01/21',
  },
  {
    buy_price: 873270,
    sell_price: 838572,
    datetime: '23/01/21',
  },
  {
    buy_price: 869778,
    sell_price: 834544,
    datetime: '24/01/21',
  },
  {
    buy_price: 874934,
    sell_price: 840175,
    datetime: '25/01/21',
  },
  {
    buy_price: 875612,
    sell_price: 840847,
    datetime: '26/01/21',
  },
  {
    buy_price: 873694,
    sell_price: 838987,
    datetime: '27/01/21',
  },
  {
    buy_price: 873112,
    sell_price: 838235,
    datetime: '28/01/21',
  },
  {
    buy_price: 873035,
    sell_price: 838343,
    datetime: '29/01/21',
  },
  {
    buy_price: 868138,
    sell_price: 833639,
    datetime: '30/01/21',
  },
  {
    buy_price: 862999,
    sell_price: 828108,
    datetime: '31/01/21',
  },
  {
    buy_price: 875181,
    sell_price: 840398,
    datetime: '01/02/21',
  },
  {
    buy_price: 875064,
    sell_price: 840277,
    datetime: '02/02/21',
  },
  {
    buy_price: 860681,
    sell_price: 826500,
    datetime: '03/02/21',
  },
  {
    buy_price: 857758,
    sell_price: 823276,
    datetime: '04/02/21',
  },
  {
    buy_price: 846735,
    sell_price: 813091,
    datetime: '05/02/21',
  },
  {
    buy_price: 846422,
    sell_price: 812784,
    datetime: '06/02/21',
  },
  {
    buy_price: 846314,
    sell_price: 811954,
    datetime: '07/02/21',
  },
  {
    buy_price: 858041,
    sell_price: 824001,
    datetime: '08/02/21',
  },
  {
    buy_price: 860743,
    sell_price: 826560,
    datetime: '09/02/21',
  },
  {
    buy_price: 862535,
    sell_price: 828259,
    datetime: '10/02/21',
  },
  {
    buy_price: 861413,
    sell_price: 827181,
    datetime: '11/02/21',
  },
  {
    buy_price: 852464,
    sell_price: 818600,
    datetime: '12/02/21',
  },
  {
    buy_price: 849595,
    sell_price: 815376,
    datetime: '13/02/21',
  },
  {
    buy_price: 849542,
    sell_price: 815145,
    datetime: '14/02/21',
  },
  {
    buy_price: 850072,
    sell_price: 816249,
    datetime: '15/02/21',
  },
  {
    buy_price: 847389,
    sell_price: 813750,
    datetime: '16/02/21',
  },
  {
    buy_price: 842601,
    sell_price: 809114,
    datetime: '17/02/21',
  },
  {
    buy_price: 837982,
    sell_price: 804663,
    datetime: '18/02/21',
  },
  {
    buy_price: 839543,
    sell_price: 806177,
    datetime: '19/02/21',
  },
  {
    buy_price: 837090,
    sell_price: 803824,
    datetime: '20/02/21',
  },
  {
    buy_price: 835564,
    sell_price: 801718,
    datetime: '21/02/21',
  },
  {
    buy_price: 852366,
    sell_price: 818510,
    datetime: '22/02/21',
  },
  {
    buy_price: 854542,
    sell_price: 820563,
    datetime: '23/02/21',
  },
  {
    buy_price: 850057,
    sell_price: 816234,
    datetime: '24/02/21',
  },
  {
    buy_price: 847042,
    sell_price: 813005,
    datetime: '25/02/21',
  },
  {
    buy_price: 851052,
    sell_price: 816702,
    datetime: '26/02/21',
  },
  {
    buy_price: 841705,
    sell_price: 808240,
    datetime: '27/02/21',
  },
  {
    buy_price: 827818,
    sell_price: 794150,
    datetime: '28/02/21',
  },
  {
    buy_price: 835569,
    sell_price: 802353,
    datetime: '01/03/21',
  },
  {
    buy_price: 827192,
    sell_price: 794286,
    datetime: '02/03/21',
  },
  {
    buy_price: 831269,
    sell_price: 798210,
    datetime: '03/03/21',
  },
  {
    buy_price: 819369,
    sell_price: 786822,
    datetime: '04/03/21',
  },
  {
    buy_price: 816639,
    sell_price: 784191,
    datetime: '05/03/21',
  },
  {
    buy_price: 817980,
    sell_price: 785478,
    datetime: '06/03/21',
  },
  {
    buy_price: 814962,
    sell_price: 780910,
    datetime: '07/03/21',
  },
  {
    buy_price: 820743,
    sell_price: 788105,
    datetime: '08/03/21',
  },
  {
    buy_price: 824987,
    sell_price: 792231,
    datetime: '09/03/21',
  },
  {
    buy_price: 827593,
    sell_price: 794710,
    datetime: '10/03/21',
  },
  {
    buy_price: 832014,
    sell_price: 798967,
    datetime: '11/03/21',
  },
  {
    buy_price: 826897,
    sell_price: 794057,
    datetime: '12/03/21',
  },
  {
    buy_price: 830270,
    sell_price: 797042,
    datetime: '13/03/21',
  },
  {
    buy_price: 828290,
    sell_price: 793316,
    datetime: '14/03/21',
  },
  {
    buy_price: 831484,
    sell_price: 798449,
    datetime: '15/03/21',
  },
  {
    buy_price: 839228,
    sell_price: 805890,
    datetime: '16/03/21',
  },
  {
    buy_price: 837718,
    sell_price: 804430,
    datetime: '17/03/21',
  },
  {
    buy_price: 840810,
    sell_price: 807399,
    datetime: '18/03/21',
  },
  {
    buy_price: 838276,
    sell_price: 804901,
    datetime: '19/03/21',
  },
  {
    buy_price: 839250,
    sell_price: 804380,
    datetime: '20/03/21',
  },
  {
    buy_price: 835487,
    sell_price: 800772,
    datetime: '21/03/21',
  },
  {
    buy_price: 836503,
    sell_price: 803273,
    datetime: '22/03/21',
  },
  {
    buy_price: 839749,
    sell_price: 806404,
    datetime: '23/03/21',
  },
  {
    buy_price: 836163,
    sell_price: 802946,
    datetime: '24/03/21',
  },
  {
    buy_price: 838515,
    sell_price: 805219,
    datetime: '25/03/21',
  },
  {
    buy_price: 834667,
    sell_price: 801489,
    datetime: '26/03/21',
  },
  {
    buy_price: 834322,
    sell_price: 800406,
    datetime: '27/03/21',
  },
  {
    buy_price: 832147,
    sell_price: 798320,
    datetime: '28/03/21',
  },
  {
    buy_price: 833054,
    sell_price: 799942,
    datetime: '29/03/21',
  },
  {
    buy_price: 828008,
    sell_price: 794723,
    datetime: '30/03/21',
  },
  {
    buy_price: 829413,
    sell_price: 796468,
    datetime: '31/03/21',
  },
  {
    buy_price: 835982,
    sell_price: 802772,
    datetime: '01/04/21',
  },
  {
    buy_price: 839102,
    sell_price: 804055,
    datetime: '02/04/21',
  },
  {
    buy_price: 838094,
    sell_price: 803089,
    datetime: '03/04/21',
  },
  {
    buy_price: 837517,
    sell_price: 802537,
    datetime: '04/04/21',
  },
  {
    buy_price: 837517,
    sell_price: 803577,
    datetime: '05/04/21',
  },
  {
    buy_price: 840987,
    sell_price: 807602,
    datetime: '06/04/21',
  },
  {
    buy_price: 844142,
    sell_price: 810623,
    datetime: '07/04/21',
  },
  {
    buy_price: 854912,
    sell_price: 820941,
    datetime: '08/04/21',
  },
  {
    buy_price: 857751,
    sell_price: 822730,
    datetime: '09/04/21',
  },
  {
    buy_price: 851151,
    sell_price: 817369,
    datetime: '10/04/21',
  },
  {
    buy_price: 848483,
    sell_price: 813152,
    datetime: '11/04/21',
  },
  {
    buy_price: 848483,
    sell_price: 814513,
    datetime: '12/04/21',
  },
  {
    buy_price: 851975,
    sell_price: 818154,
    datetime: '13/04/21',
  },
  {
    buy_price: 854501,
    sell_price: 820584,
    datetime: '14/04/21',
  },
  {
    buy_price: 857946,
    sell_price: 823884,
    datetime: '15/04/21',
  },
  {
    buy_price: 862992,
    sell_price: 828721,
    datetime: '16/04/21',
  },
  {
    buy_price: 862149,
    sell_price: 827692,
    datetime: '17/04/21',
  },
  {
    buy_price: 859065,
    sell_price: 824347,
    datetime: '18/04/21',
  },
  {
    buy_price: 865331,
    sell_price: 830972,
    datetime: '19/04/21',
  },
  {
    buy_price: 863401,
    sell_price: 829099,
    datetime: '20/04/21',
  },
  {
    buy_price: 870283,
    sell_price: 835724,
    datetime: '21/04/21',
  },
  {
    buy_price: 870461,
    sell_price: 835899,
    datetime: '22/04/21',
  },
  {
    buy_price: 868335,
    sell_price: 833433,
    datetime: '23/04/21',
  },
  {
    buy_price: 861588,
    sell_price: 826405,
    datetime: '24/04/21',
  },
  {
    buy_price: 858643,
    sell_price: 823579,
    datetime: '25/04/21',
  },
  {
    buy_price: 860847,
    sell_price: 826667,
    datetime: '26/04/21',
  },
  {
    buy_price: 862246,
    sell_price: 828009,
    datetime: '27/04/21',
  },
  {
    buy_price: 863162,
    sell_price: 827096,
    datetime: '28/04/21',
  },
  {
    buy_price: 862384,
    sell_price: 828129,
    datetime: '29/04/21',
  },
  {
    buy_price: 854611,
    sell_price: 820701,
    datetime: '30/04/21',
  },
  {
    buy_price: 853750,
    sell_price: 819743,
    datetime: '01/05/21',
  },
  {
    buy_price: 850818,
    sell_price: 815931,
    datetime: '02/05/21',
  },
  {
    buy_price: 861448,
    sell_price: 827215,
    datetime: '03/05/21',
  },
  {
    buy_price: 865515,
    sell_price: 831122,
    datetime: '04/05/21',
  },
  {
    buy_price: 860891,
    sell_price: 826499,
    datetime: '05/05/21',
  },
  {
    buy_price: 864407,
    sell_price: 830090,
    datetime: '06/05/21',
  },
  {
    buy_price: 869150,
    sell_price: 834606,
    datetime: '07/05/21',
  },
  {
    buy_price: 862527,
    sell_price: 828177,
    datetime: '08/05/21',
  },
  {
    buy_price: 861485,
    sell_price: 826689,
    datetime: '09/05/21',
  },
  {
    buy_price: 873191,
    sell_price: 838499,
    datetime: '10/05/21',
  },
  {
    buy_price: 870631,
    sell_price: 836060,
    datetime: '11/05/21',
  },
  {
    buy_price: 875064,
    sell_price: 840321,
    datetime: '12/05/21',
  },
  {
    buy_price: 871036,
    sell_price: 836444,
    datetime: '13/05/21',
  },
  {
    buy_price: 875867,
    sell_price: 841105,
    datetime: '14/05/21',
  },
  {
    buy_price: 876255,
    sell_price: 841416,
    datetime: '15/05/21',
  },
  {
    buy_price: 876078,
    sell_price: 840205,
    datetime: '16/05/21',
  },
  {
    buy_price: 891671,
    sell_price: 856264,
    datetime: '17/05/21',
  },
  {
    buy_price: 895286,
    sell_price: 859737,
    datetime: '18/05/21',
  },
  {
    buy_price: 904542,
    sell_price: 868598,
    datetime: '19/05/21',
  },
  {
    buy_price: 900589,
    sell_price: 864802,
    datetime: '20/05/21',
  },
  {
    buy_price: 900938,
    sell_price: 865137,
    datetime: '21/05/21',
  },
  {
    buy_price: 900258,
    sell_price: 864260,
    datetime: '22/05/21',
  },
  {
    buy_price: 899880,
    sell_price: 863405,
    datetime: '23/05/21',
  },
  {
    buy_price: 901372,
    sell_price: 865554,
    datetime: '24/05/21',
  },
  {
    buy_price: 904478,
    sell_price: 868565,
    datetime: '25/05/21',
  },
  {
    buy_price: 909709,
    sell_price: 873597,
    datetime: '26/05/21',
  },
  {
    buy_price: 905690,
    sell_price: 869711,
    datetime: '27/05/21',
  },
  {
    buy_price: 906493,
    sell_price: 870453,
    datetime: '28/05/21',
  },
  {
    buy_price: 909132,
    sell_price: 872622,
    datetime: '29/05/21',
  },
  {
    buy_price: 906685,
    sell_price: 869939,
    datetime: '30/05/21',
  },
  {
    buy_price: 908866,
    sell_price: 872777,
    datetime: '31/05/21',
  },
  {
    buy_price: 909041,
    sell_price: 872943,
    datetime: '01/06/21',
  },
  {
    buy_price: 905850,
    sell_price: 873313,
    datetime: '02/06/21',
  },
  {
    buy_price: 908314,
    sell_price: 872227,
    datetime: '03/06/21',
  },
  {
    buy_price: 900602,
    sell_price: 864824,
    datetime: '04/06/21',
  },
  {
    buy_price: 899369,
    sell_price: 863545,
    datetime: '05/06/21',
  },
  {
    buy_price: 896916,
    sell_price: 860575,
    datetime: '06/06/21',
  },
  {
    buy_price: 899822,
    sell_price: 864071,
    datetime: '07/06/21',
  },
  {
    buy_price: 902788,
    sell_price: 866919,
    datetime: '08/06/21',
  },
  {
    buy_price: 902354,
    sell_price: 866502,
    datetime: '09/06/21',
  },
  {
    buy_price: 899699,
    sell_price: 863706,
    datetime: '10/06/21',
  },
  {
    buy_price: 903062,
    sell_price: 867182,
    datetime: '11/06/21',
  },
  {
    buy_price: 889342,
    sell_price: 853982,
    datetime: '12/06/21',
  },
  {
    buy_price: 889342,
    sell_price: 852947,
    datetime: '13/06/21',
  },
  {
    buy_price: 889342,
    sell_price: 853442,
    datetime: '14/06/21',
  },
  {
    buy_price: 886954,
    sell_price: 851708,
    datetime: '15/06/21',
  },
  {
    buy_price: 884138,
    sell_price: 849008,
    datetime: '16/06/21',
  },
  {
    buy_price: 883129,
    sell_price: 848039,
    datetime: '17/06/21',
  },
  {
    buy_price: 861444,
    sell_price: 827245,
    datetime: '18/06/21',
  },
  {
    buy_price: 859536,
    sell_price: 825402,
    datetime: '19/06/21',
  },
  {
    buy_price: 851145,
    sell_price: 816520,
    datetime: '20/06/21',
  },
  {
    buy_price: 858338,
    sell_price: 824271,
    datetime: '21/06/21',
  },
  {
    buy_price: 860288,
    sell_price: 826126,
    datetime: '22/06/21',
  },
  {
    buy_price: 862942,
    sell_price: 828668,
    datetime: '23/06/21',
  },
  {
    buy_price: 859955,
    sell_price: 825800,
    datetime: '24/06/21',
  },
  {
    buy_price: 859695,
    sell_price: 825537,
    datetime: '25/06/21',
  },
  {
    buy_price: 859949,
    sell_price: 825512,
    datetime: '26/06/21',
  },
  {
    buy_price: 857713,
    sell_price: 821813,
    datetime: '27/06/21',
  },
  {
    buy_price: 860480,
    sell_price: 826276,
    datetime: '28/06/21',
  },
  {
    buy_price: 860768,
    sell_price: 826307,
    datetime: '29/06/21',
  },
  {
    buy_price: 858720,
    sell_price: 824596,
    datetime: '30/06/21',
  },
  {
    buy_price: 861759,
    sell_price: 827518,
    datetime: '01/07/21',
  },
  {
    buy_price: 868013,
    sell_price: 833247,
    datetime: '02/07/21',
  },
  {
    buy_price: 864468,
    sell_price: 830111,
    datetime: '03/07/21',
  },
  {
    buy_price: 860534,
    sell_price: 825538,
    datetime: '04/07/21',
  },
  {
    buy_price: 865815,
    sell_price: 831456,
    datetime: '05/07/21',
  },
  {
    buy_price: 875069,
    sell_price: 840311,
    datetime: '06/07/21',
  },
  {
    buy_price: 872750,
    sell_price: 838061,
    datetime: '07/07/21',
  },
  {
    buy_price: 882928,
    sell_price: 847854,
    datetime: '08/07/21',
  },
  {
    buy_price: 878230,
    sell_price: 843220,
    datetime: '09/07/21',
  },
  {
    buy_price: 869723,
    sell_price: 835014,
    datetime: '10/07/21',
  },
  {
    buy_price: 868106,
    sell_price: 832362,
    datetime: '11/07/21',
  },
  {
    buy_price: 870568,
    sell_price: 835811,
    datetime: '12/07/21',
  },
  {
    buy_price: 872240,
    sell_price: 837164,
    datetime: '13/07/21',
  },
  {
    buy_price: 876707,
    sell_price: 841716,
    datetime: '14/07/21',
  },
  {
    buy_price: 881118,
    sell_price: 845952,
    datetime: '15/07/21',
  },
  {
    buy_price: 885144,
    sell_price: 849812,
    datetime: '16/07/21',
  },
  {
    buy_price: 873388,
    sell_price: 838422,
    datetime: '17/07/21',
  },
  {
    buy_price: 870238,
    sell_price: 834053,
    datetime: '18/07/21',
  },
  {
    buy_price: 875887,
    sell_price: 840923,
    datetime: '19/07/21',
  },
  {
    buy_price: 882183,
    sell_price: 846958,
    datetime: '20/07/21',
  },
  {
    buy_price: 877619,
    sell_price: 842178,
    datetime: '21/07/21',
  },
  {
    buy_price: 870345,
    sell_price: 834447,
    datetime: '22/07/21',
  },
  {
    buy_price: 871490,
    sell_price: 836710,
    datetime: '23/07/21',
  },
  {
    buy_price: 867380,
    sell_price: 832183,
    datetime: '24/07/21',
  },
  {
    buy_price: 864462,
    sell_price: 829112,
    datetime: '25/07/21',
  },
  {
    buy_price: 869236,
    sell_price: 834579,
    datetime: '26/07/21',
  },
  {
    buy_price: 866621,
    sell_price: 832026,
    datetime: '27/07/21',
  },
  {
    buy_price: 868159,
    sell_price: 833512,
    datetime: '28/07/21',
  },
  {
    buy_price: 875768,
    sell_price: 840815,
    datetime: '29/07/21',
  },
  {
    buy_price: 877922,
    sell_price: 842869,
    datetime: '30/07/21',
  },
  {
    buy_price: 870041,
    sell_price: 835297,
    datetime: '31/07/21',
  },
  {
    buy_price: 868002,
    sell_price: 831952,
    datetime: '01/08/21',
  },
  {
    buy_price: 870226,
    sell_price: 835480,
    datetime: '02/08/21',
  },
  {
    buy_price: 866328,
    sell_price: 831769,
    datetime: '03/08/21',
  },
  {
    buy_price: 867446,
    sell_price: 832866,
    datetime: '04/08/21',
  },
  {
    buy_price: 864378,
    sell_price: 828575,
    datetime: '05/08/21',
  },
  {
    buy_price: 861142,
    sell_price: 826497,
    datetime: '06/08/21',
  },
  {
    buy_price: 843957,
    sell_price: 809986,
    datetime: '07/08/21',
  },
  {
    buy_price: 843589,
    sell_price: 809145,
    datetime: '08/08/21',
  },
  {
    buy_price: 844121,
    sell_price: 810357,
    datetime: '09/08/21',
  },
  {
    buy_price: 829660,
    sell_price: 796556,
    datetime: '10/08/21',
  },
  {
    buy_price: 833888,
    sell_price: 800626,
    datetime: '11/08/21',
  },
  {
    buy_price: 838826,
    sell_price: 805343,
    datetime: '12/08/21',
  },
  {
    buy_price: 845855,
    sell_price: 812111,
    datetime: '13/08/21',
  },
  {
    buy_price: 848352,
    sell_price: 814489,
    datetime: '14/08/21',
  },
  {
    buy_price: 847306,
    sell_price: 812016,
    datetime: '15/08/21',
  },
  {
    buy_price: 851530,
    sell_price: 817546,
    datetime: '16/08/21',
  },
  {
    buy_price: 856012,
    sell_price: 821850,
    datetime: '17/08/21',
  },
  {
    buy_price: 856472,
    sell_price: 822282,
    datetime: '18/08/21',
  },
  {
    buy_price: 859155,
    sell_price: 824858,
    datetime: '19/08/21',
  },
  {
    buy_price: 858539,
    sell_price: 824298,
    datetime: '20/08/21',
  },
  {
    buy_price: 852971,
    sell_price: 818957,
    datetime: '21/08/21',
  },
  {
    buy_price: 850116,
    sell_price: 815241,
    datetime: '22/08/21',
  },
  {
    buy_price: 861347,
    sell_price: 826968,
    datetime: '23/08/21',
  },
  {
    buy_price: 866485,
    sell_price: 831901,
    datetime: '24/08/21',
  },
  {
    buy_price: 863129,
    sell_price: 828510,
    datetime: '25/08/21',
  },
  {
    buy_price: 860773,
    sell_price: 826425,
    datetime: '26/08/21',
  },
  {
    buy_price: 864228,
    sell_price: 829753,
    datetime: '27/08/21',
  },
  {
    buy_price: 864976,
    sell_price: 830453,
    datetime: '28/08/21',
  },
  {
    buy_price: 862438,
    sell_price: 827073,
    datetime: '29/08/21',
  },
  {
    buy_price: 870302,
    sell_price: 835566,
    datetime: '30/08/21',
  },
  {
    buy_price: 861748,
    sell_price: 827362,
    datetime: '31/08/21',
  },
  {
    buy_price: 860126,
    sell_price: 825801,
    datetime: '01/09/21',
  },
  {
    buy_price: 859236,
    sell_price: 824978,
    datetime: '02/09/21',
  },
  {
    buy_price: 865788,
    sell_price: 831251,
    datetime: '03/09/21',
  },
  {
    buy_price: 865060,
    sell_price: 830562,
    datetime: '04/09/21',
  },
  {
    buy_price: 863105,
    sell_price: 827724,
    datetime: '05/09/21',
  },
  {
    buy_price: 864372,
    sell_price: 829887,
    datetime: '06/09/21',
  },
  {
    buy_price: 862232,
    sell_price: 827864,
    datetime: '07/09/21',
  },
  {
    buy_price: 855636,
    sell_price: 821645,
    datetime: '08/09/21',
  },
  {
    buy_price: 854011,
    sell_price: 820084,
    datetime: '09/09/21',
  },
  {
    buy_price: 855164,
    sell_price: 821200,
    datetime: '10/09/21',
  },
  {
    buy_price: 850260,
    sell_price: 816509,
    datetime: '11/09/21',
  },
  {
    buy_price: 849062,
    sell_price: 814210,
    datetime: '12/09/21',
  },
  {
    buy_price: 852352,
    sell_price: 818491,
    datetime: '13/09/21',
  },
  {
    buy_price: 857396,
    sell_price: 823366,
    datetime: '14/09/21',
  },
  {
    buy_price: 858515,
    sell_price: 823958,
    datetime: '15/09/21',
  },
  {
    buy_price: 852499,
    sell_price: 818636,
    datetime: '16/09/21',
  },
  {
    buy_price: 837348,
    sell_price: 804085,
    datetime: '17/09/21',
  },
  {
    buy_price: 833261,
    sell_price: 799700,
    datetime: '18/09/21',
  },
  {
    buy_price: 833261,
    sell_price: 799240,
    datetime: '19/09/21',
  },
  {
    buy_price: 839618,
    sell_price: 806261,
    datetime: '20/09/21',
  },
  {
    buy_price: 844382,
    sell_price: 810855,
    datetime: '21/09/21',
  },
  {
    buy_price: 844585,
    sell_price: 811073,
    datetime: '22/09/21',
  },
  {
    buy_price: 845083,
    sell_price: 811528,
    datetime: '23/09/21',
  },
  {
    buy_price: 835388,
    sell_price: 802205,
    datetime: '24/09/21',
  },
  {
    buy_price: 835983,
    sell_price: 800110,
    datetime: '25/09/21',
  },
  {
    buy_price: 833446,
    sell_price: 797681,
    datetime: '26/09/21',
  },
  {
    buy_price: 835533,
    sell_price: 802356,
    datetime: '27/09/21',
  },
  {
    buy_price: 833771,
    sell_price: 800143,
    datetime: '28/09/21',
  },
  {
    buy_price: 830666,
    sell_price: 797677,
    datetime: '29/09/21',
  },
  {
    buy_price: 839260,
    sell_price: 805945,
    datetime: '30/09/21',
  },
  {
    buy_price: 840863,
    sell_price: 806679,
    datetime: '01/10/21',
  },
  {
    buy_price: 838945,
    sell_price: 805539,
    datetime: '02/10/21',
  },
  {
    buy_price: 836860,
    sell_price: 802609,
    datetime: '03/10/21',
  },
  {
    buy_price: 840603,
    sell_price: 807220,
    datetime: '04/10/21',
  },
  {
    buy_price: 842686,
    sell_price: 808604,
    datetime: '05/10/21',
  },
  {
    buy_price: 837199,
    sell_price: 803942,
    datetime: '06/10/21',
  },
  {
    buy_price: 838213,
    sell_price: 804948,
    datetime: '07/10/21',
  },
  {
    buy_price: 841329,
    sell_price: 807928,
    datetime: '08/10/21',
  },
  {
    buy_price: 835320,
    sell_price: 802197,
    datetime: '09/10/21',
  },
  {
    buy_price: 834314,
    sell_price: 800178,
    datetime: '10/10/21',
  },
  {
    buy_price: 834314,
    sell_price: 800931,
    datetime: '11/10/21',
  },
  {
    buy_price: 836080,
    sell_price: 802895,
    datetime: '12/10/21',
  },
  {
    buy_price: 849314,
    sell_price: 815600,
    datetime: '13/10/21',
  },
  {
    buy_price: 850096,
    sell_price: 815342,
    datetime: '14/10/21',
  },
  {
    buy_price: 843242,
    sell_price: 809743,
    datetime: '15/10/21',
  },
  {
    buy_price: 829073,
    sell_price: 795542,
    datetime: '16/10/21',
  },
  {
    buy_price: 828231,
    sell_price: 793871,
    datetime: '17/10/21',
  },
  {
    buy_price: 833191,
    sell_price: 800094,
    datetime: '18/10/21',
  },
  {
    buy_price: 837802,
    sell_price: 804527,
    datetime: '19/10/21',
  },
  {
    buy_price: 840970,
    sell_price: 807578,
    datetime: '20/10/21',
  },
  {
    buy_price: 841143,
    sell_price: 807736,
    datetime: '21/10/21',
  },
  {
    buy_price: 856506,
    sell_price: 822508,
    datetime: '22/10/21',
  },
  {
    buy_price: 850321,
    sell_price: 816531,
    datetime: '23/10/21',
  },
  {
    buy_price: 849520,
    sell_price: 814939,
    datetime: '24/10/21',
  },
  {
    buy_price: 853992,
    sell_price: 820066,
    datetime: '25/10/21',
  },
  {
    buy_price: 854326,
    sell_price: 820369,
    datetime: '26/10/21',
  },
  {
    buy_price: 850556,
    sell_price: 816752,
    datetime: '27/10/21',
  },
  {
    buy_price: 854574,
    sell_price: 820597,
    datetime: '28/10/21',
  },
  {
    buy_price: 853793,
    sell_price: 819378,
    datetime: '29/10/21',
  },
  {
    buy_price: 845115,
    sell_price: 811313,
    datetime: '30/10/21',
  },
  {
    buy_price: 845115,
    sell_price: 810626,
    datetime: '31/10/21',
  },
  {
    buy_price: 852939,
    sell_price: 819068,
    datetime: '01/11/21',
  },
  {
    buy_price: 855107,
    sell_price: 820999,
    datetime: '02/11/21',
  },
  {
    buy_price: 854180,
    sell_price: 820264,
    datetime: '03/11/21',
  },
  {
    buy_price: 860093,
    sell_price: 825897,
    datetime: '04/11/21',
  },
  {
    buy_price: 865221,
    sell_price: 830840,
    datetime: '05/11/21',
  },
  {
    buy_price: 869847,
    sell_price: 833125,
    datetime: '06/11/21',
  },
  {
    buy_price: 867263,
    sell_price: 830651,
    datetime: '07/11/21',
  },
  {
    buy_price: 870571,
    sell_price: 835997,
    datetime: '08/11/21',
  },
  {
    buy_price: 868877,
    sell_price: 834361,
    datetime: '09/11/21',
  },
  {
    buy_price: 885056,
    sell_price: 849894,
    datetime: '10/11/21',
  },
  {
    buy_price: 887522,
    sell_price: 852262,
    datetime: '11/11/21',
  },
  {
    buy_price: 886804,
    sell_price: 851253,
    datetime: '12/11/21',
  },
  {
    buy_price: 883493,
    sell_price: 848384,
    datetime: '13/11/21',
  },
  {
    buy_price: 881166,
    sell_price: 845189,
    datetime: '14/11/21',
  },
  {
    buy_price: 883725,
    sell_price: 848621,
    datetime: '15/11/21',
  },
  {
    buy_price: 889010,
    sell_price: 853696,
    datetime: '16/11/21',
  },
  {
    buy_price: 885914,
    sell_price: 850732,
    datetime: '17/11/21',
  },
  {
    buy_price: 886867,
    sell_price: 851652,
    datetime: '18/11/21',
  },
  {
    buy_price: 887435,
    sell_price: 852189,
    datetime: '19/11/21',
  },
  {
    buy_price: 881960,
    sell_price: 846935,
    datetime: '20/11/21',
  },
  {
    buy_price: 876855,
    sell_price: 841380,
    datetime: '21/11/21',
  },
  {
    buy_price: 878008,
    sell_price: 843129,
    datetime: '22/11/21',
  },
  {
    buy_price: 862005,
    sell_price: 827757,
    datetime: '23/11/21',
  },
  {
    buy_price: 853598,
    sell_price: 819711,
    datetime: '24/11/21',
  },
  {
    buy_price: 855335,
    sell_price: 821405,
    datetime: '25/11/21',
  },
  {
    buy_price: 870229,
    sell_price: 835667,
    datetime: '26/11/21',
  },
  {
    buy_price: 859814,
    sell_price: 825134,
    datetime: '27/11/21',
  },
  {
    buy_price: 858013,
    sell_price: 823406,
    datetime: '28/11/21',
  },
  {
    buy_price: 861352,
    sell_price: 827124,
    datetime: '29/11/21',
  },
  {
    buy_price: 861734,
    sell_price: 827478,
    datetime: '30/11/21',
  },
  {
    buy_price: 856253,
    sell_price: 822241,
    datetime: '01/12/21',
  },
  {
    buy_price: 856085,
    sell_price: 822061,
    datetime: '02/12/21',
  },
  {
    buy_price: 857668,
    sell_price: 823590,
    datetime: '03/12/21',
  },
  {
    buy_price: 862860,
    sell_price: 828530,
    datetime: '04/12/21',
  },
  {
    buy_price: 862618,
    sell_price: 827295,
    datetime: '05/12/21',
  },
  {
    buy_price: 862917,
    sell_price: 828580,
    datetime: '06/12/21',
  },
  {
    buy_price: 859475,
    sell_price: 825325,
    datetime: '07/12/21',
  },
  {
    buy_price: 858825,
    sell_price: 824720,
    datetime: '08/12/21',
  },
  {
    buy_price: 856640,
    sell_price: 822603,
    datetime: '09/12/21',
  },
  {
    buy_price: 856252,
    sell_price: 822272,
    datetime: '10/12/21',
  },
  {
    buy_price: 854690,
    sell_price: 820316,
    datetime: '11/12/21',
  },
  {
    buy_price: 852019,
    sell_price: 817285,
    datetime: '12/12/21',
  },
  {
    buy_price: 854656,
    sell_price: 820694,
    datetime: '13/12/21',
  },
  {
    buy_price: 854870,
    sell_price: 820908,
    datetime: '14/12/21',
  },
  {
    buy_price: 847402,
    sell_price: 813736,
    datetime: '15/12/21',
  },
  {
    buy_price: 860528,
    sell_price: 826338,
    datetime: '16/12/21',
  },
  {
    buy_price: 867177,
    sell_price: 832728,
    datetime: '17/12/21',
  },
  {
    buy_price: 864437,
    sell_price: 830078,
    datetime: '18/12/21',
  },
  {
    buy_price: 861331,
    sell_price: 826093,
    datetime: '19/12/21',
  },
  {
    buy_price: 864114,
    sell_price: 829795,
    datetime: '20/12/21',
  },
  {
    buy_price: 860119,
    sell_price: 825986,
    datetime: '21/12/21',
  },
  {
    buy_price: 852810,
    sell_price: 818967,
    datetime: '22/12/21',
  },
  {
    buy_price: 857098,
    sell_price: 823067,
    datetime: '23/12/21',
  },
  {
    buy_price: 858027,
    sell_price: 823535,
    datetime: '24/12/21',
  },
  {
    buy_price: 854510,
    sell_price: 820161,
    datetime: '25/12/21',
  },
  {
    buy_price: 854435,
    sell_price: 820088,
    datetime: '26/12/21',
  },
  {
    buy_price: 858159,
    sell_price: 824068,
    datetime: '27/12/21',
  },
  {
    buy_price: 861959,
    sell_price: 827731,
    datetime: '28/12/21',
  },
  {
    buy_price: 858344,
    sell_price: 824212,
    datetime: '29/12/21',
  },
  {
    buy_price: 860814,
    sell_price: 826627,
    datetime: '30/12/21',
  },
  {
    buy_price: 865322,
    sell_price: 830919,
    datetime: '31/12/21',
  },
  {
    buy_price: 867885,
    sell_price: 833134,
    datetime: '01/01/22',
  },
  {
    buy_price: 867885,
    sell_price: 832170,
    datetime: '02/01/22',
  },
  {
    buy_price: 868793,
    sell_price: 834281,
    datetime: '03/01/22',
  },
  {
    buy_price: 869157,
    sell_price: 834621,
    datetime: '04/01/22',
  },
  {
    buy_price: 874671,
    sell_price: 839947,
    datetime: '05/01/22',
  },
  {
    buy_price: 874202,
    sell_price: 839489,
    datetime: '06/01/22',
  },
  {
    buy_price: 859847,
    sell_price: 825701,
    datetime: '07/01/22',
  },
  {
    buy_price: 858192,
    sell_price: 823952,
    datetime: '08/01/22',
  },
  {
    buy_price: 856491,
    sell_price: 820470,
    datetime: '09/01/22',
  },
  {
    buy_price: 856450,
    sell_price: 822439,
    datetime: '10/01/22',
  },
  {
    buy_price: 864742,
    sell_price: 830381,
    datetime: '11/01/22',
  },
  {
    buy_price: 871681,
    sell_price: 836943,
    datetime: '12/01/22',
  },
  {
    buy_price: 873861,
    sell_price: 839008,
    datetime: '13/01/22',
  },
  {
    buy_price: 873983,
    sell_price: 839152,
    datetime: '14/01/22',
  },
  {
    buy_price: 870388,
    sell_price: 835360,
    datetime: '15/01/22',
  },
  {
    buy_price: 869389,
    sell_price: 834204,
    datetime: '16/01/22',
  },
  {
    buy_price: 871151,
    sell_price: 836446,
    datetime: '17/01/22',
  },
  {
    buy_price: 869898,
    sell_price: 835341,
    datetime: '18/01/22',
  },
  {
    buy_price: 880263,
    sell_price: 845304,
    datetime: '19/01/22',
  },
  {
    buy_price: 881635,
    sell_price: 846604,
    datetime: '20/01/22',
  },
  {
    buy_price: 879738,
    sell_price: 844828,
    datetime: '21/01/22',
  },
  {
    buy_price: 875445,
    sell_price: 840146,
    datetime: '22/01/22',
  },
  {
    buy_price: 875445,
    sell_price: 838488,
    datetime: '23/01/22',
  },
  {
    buy_price: 880147,
    sell_price: 845202,
    datetime: '24/01/22',
  },
  {
    buy_price: 884356,
    sell_price: 849226,
    datetime: '25/01/22',
  },
  {
    buy_price: 884095,
    sell_price: 848994,
    datetime: '26/01/22',
  },
  {
    buy_price: 874380,
    sell_price: 839636,
    datetime: '27/01/22',
  },
  {
    buy_price: 861401,
    sell_price: 827130,
    datetime: '28/01/22',
  },
  {
    buy_price: 857950,
    sell_price: 823689,
    datetime: '29/01/22',
  },
  {
    buy_price: 857950,
    sell_price: 823383,
    datetime: '30/01/22',
  },
  {
    buy_price: 860365,
    sell_price: 826199,
    datetime: '31/01/22',
  },
  {
    buy_price: 862494,
    sell_price: 828253,
    datetime: '01/02/22',
  },
  {
    buy_price: 865936,
    sell_price: 831582,
    datetime: '02/02/22',
  },
  {
    buy_price: 865684,
    sell_price: 831321,
    datetime: '03/02/22',
  },
  {
    buy_price: 868922,
    sell_price: 834390,
    datetime: '04/02/22',
  },
  {
    buy_price: 868540,
    sell_price: 834051,
    datetime: '05/02/22',
  },
  {
    buy_price: 866832,
    sell_price: 831392,
    datetime: '06/02/22',
  },
  {
    buy_price: 871471,
    sell_price: 836874,
    datetime: '07/02/22',
  },
  {
    buy_price: 875416,
    sell_price: 840654,
    datetime: '08/02/22',
  },
  {
    buy_price: 876011,
    sell_price: 840840,
    datetime: '09/02/22',
  },
  {
    buy_price: 878406,
    sell_price: 843526,
    datetime: '10/02/22',
  },
  {
    buy_price: 877521,
    sell_price: 842677,
    datetime: '11/02/22',
  },
  {
    buy_price: 890515,
    sell_price: 855160,
    datetime: '12/02/22',
  },
  {
    buy_price: 887574,
    sell_price: 851652,
    datetime: '13/02/22',
  },
  {
    buy_price: 891771,
    sell_price: 856357,
    datetime: '14/02/22',
  },
  {
    buy_price: 896016,
    sell_price: 860448,
    datetime: '15/02/22',
  },
  {
    buy_price: 886803,
    sell_price: 851599,
    datetime: '16/02/22',
  },
  {
    buy_price: 905935,
    sell_price: 869968,
    datetime: '17/02/22',
  },
  {
    buy_price: 909306,
    sell_price: 873207,
    datetime: '18/02/22',
  },
  {
    buy_price: 908330,
    sell_price: 872255,
    datetime: '19/02/22',
  },
  {
    buy_price: 908330,
    sell_price: 870928,
    datetime: '20/02/22',
  },
  {
    buy_price: 912303,
    sell_price: 876056,
    datetime: '21/02/22',
  },
  {
    buy_price: 915350,
    sell_price: 878989,
    datetime: '22/02/22',
  },
  {
    buy_price: 913587,
    sell_price: 877326,
    datetime: '23/02/22',
  },
  {
    buy_price: 946221,
    sell_price: 908678,
    datetime: '24/02/22',
  },
  {
    buy_price: 925914,
    sell_price: 889165,
    datetime: '25/02/22',
  },
  {
    buy_price: 902821,
    sell_price: 866982,
    datetime: '26/02/22',
  },
  {
    buy_price: 901582,
    sell_price: 865065,
    datetime: '27/02/22',
  },
  {
    buy_price: 920270,
    sell_price: 883086,
    datetime: '28/02/22',
  },
  {
    buy_price: 927746,
    sell_price: 890920,
    datetime: '01/03/22',
  },
  {
    buy_price: 934883,
    sell_price: 897733,
    datetime: '02/03/22',
  },
  {
    buy_price: 928121,
    sell_price: 891286,
    datetime: '03/03/22',
  },
  {
    buy_price: 941147,
    sell_price: 903735,
    datetime: '04/03/22',
  },
  {
    buy_price: 946944,
    sell_price: 906151,
    datetime: '05/03/22',
  },
  {
    buy_price: 946944,
    sell_price: 905260,
    datetime: '06/03/22',
  },
  {
    buy_price: 961045,
    sell_price: 922807,
    datetime: '07/03/22',
  },
  {
    buy_price: 989959,
    sell_price: 950627,
    datetime: '08/03/22',
  },
  {
    buy_price: 990089,
    sell_price: 950711,
    datetime: '09/03/22',
  },
  {
    buy_price: 954746,
    sell_price: 916809,
    datetime: '10/03/22',
  },
  {
    buy_price: 952449,
    sell_price: 914977,
    datetime: '11/03/22',
  },
  {
    buy_price: 950629,
    sell_price: 910252,
    datetime: '12/03/22',
  },
  {
    buy_price: 950629,
    sell_price: 909698,
    datetime: '13/03/22',
  },
  {
    buy_price: 948795,
    sell_price: 910916,
    datetime: '14/03/22',
  },
  {
    buy_price: 935283,
    sell_price: 898095,
    datetime: '15/03/22',
  },
  {
    buy_price: 918985,
    sell_price: 882457,
    datetime: '16/03/22',
  },
  {
    buy_price: 929448,
    sell_price: 892514,
    datetime: '17/03/22',
  },
  {
    buy_price: 927159,
    sell_price: 890279,
    datetime: '18/03/22',
  },
  {
    buy_price: 921584,
    sell_price: 884957,
    datetime: '19/03/22',
  },
  {
    buy_price: 918499,
    sell_price: 880032,
    datetime: '20/03/22',
  },
  {
    buy_price: 923462,
    sell_price: 886770,
    datetime: '21/03/22',
  },
  {
    buy_price: 926268,
    sell_price: 889413,
    datetime: '22/03/22',
  },
  {
    buy_price: 926991,
    sell_price: 890154,
    datetime: '23/03/22',
  },
  {
    buy_price: 939695,
    sell_price: 902359,
    datetime: '24/03/22',
  },
  {
    buy_price: 939397,
    sell_price: 902063,
    datetime: '25/03/22',
  },
  {
    buy_price: 938430,
    sell_price: 898404,
    datetime: '26/03/22',
  },
  {
    buy_price: 936620,
    sell_price: 897616,
    datetime: '27/03/22',
  },
  {
    buy_price: 937035,
    sell_price: 898595,
    datetime: '28/03/22',
  },
  {
    buy_price: 927170,
    sell_price: 890340,
    datetime: '29/03/22',
  },
  {
    buy_price: 924232,
    sell_price: 887541,
    datetime: '30/03/22',
  },
  {
    buy_price: 929830,
    sell_price: 892099,
    datetime: '31/03/22',
  },
  {
    buy_price: 930965,
    sell_price: 893938,
    datetime: '01/04/22',
  },
  {
    buy_price: 921415,
    sell_price: 884334,
    datetime: '02/04/22',
  },
  {
    buy_price: 923196,
    sell_price: 883535,
    datetime: '03/04/22',
  },
  {
    buy_price: 923709,
    sell_price: 886997,
    datetime: '04/04/22',
  },
  {
    buy_price: 927780,
    sell_price: 890898,
    datetime: '05/04/22',
  },
  {
    buy_price: 924159,
    sell_price: 887435,
    datetime: '06/04/22',
  },
  {
    buy_price: 927079,
    sell_price: 890248,
    datetime: '07/04/22',
  },
  {
    buy_price: 931704,
    sell_price: 894671,
    datetime: '08/04/22',
  },
  {
    buy_price: 933872,
    sell_price: 894086,
    datetime: '09/04/22',
  },
  {
    buy_price: 932071,
    sell_price: 893770,
    datetime: '10/04/22',
  },
  {
    buy_price: 941126,
    sell_price: 903711,
    datetime: '11/04/22',
  },
  {
    buy_price: 944839,
    sell_price: 907294,
    datetime: '12/04/22',
  },
  {
    buy_price: 1026499,
    sell_price: 985700,
    datetime: '13/04/22',
  },
  {
    buy_price: 948050,
    sell_price: 910364,
    datetime: '14/04/22',
  },
  {
    buy_price: 949226,
    sell_price: 910783,
    datetime: '15/04/22',
  },
  {
    buy_price: 946072,
    sell_price: 906132,
    datetime: '16/04/22',
  },
  {
    buy_price: 946072,
    sell_price: 906006,
    datetime: '17/04/22',
  },
  {
    buy_price: 954266,
    sell_price: 916371,
    datetime: '18/04/22',
  },
  {
    buy_price: 949627,
    sell_price: 911930,
    datetime: '19/04/22',
  },
  {
    buy_price: 935644,
    sell_price: 898515,
    datetime: '20/04/22',
  },
  {
    buy_price: 935946,
    sell_price: 898392,
    datetime: '21/04/22',
  },
  {
    buy_price: 935377,
    sell_price: 898249,
    datetime: '22/04/22',
  },
  {
    buy_price: 932995,
    sell_price: 894761,
    datetime: '23/04/22',
  },
  {
    buy_price: 931195,
    sell_price: 892073,
    datetime: '24/04/22',
  },
  {
    buy_price: 933335,
    sell_price: 896250,
    datetime: '25/04/22',
  },
  {
    buy_price: 917151,
    sell_price: 880777,
    datetime: '26/04/22',
  },
  {
    buy_price: 918587,
    sell_price: 882133,
    datetime: '27/04/22',
  },
  {
    buy_price: 915464,
    sell_price: 878962,
    datetime: '28/04/22',
  },
  {
    buy_price: 927059,
    sell_price: 890242,
    datetime: '29/04/22',
  },
  {
    buy_price: 923998,
    sell_price: 887288,
    datetime: '30/04/22',
  },
  {
    buy_price: 918090,
    sell_price: 879451,
    datetime: '01/05/22',
  },
  {
    buy_price: 920787,
    sell_price: 884193,
    datetime: '02/05/22',
  },
  {
    buy_price: 905733,
    sell_price: 869746,
    datetime: '03/05/22',
  },
  {
    buy_price: 902850,
    sell_price: 866958,
    datetime: '04/05/22',
  },
  {
    buy_price: 916857,
    sell_price: 880454,
    datetime: '05/05/22',
  },
  {
    buy_price: 911222,
    sell_price: 875009,
    datetime: '06/05/22',
  },
  {
    buy_price: 910541,
    sell_price: 874359,
    datetime: '07/05/22',
  },
  {
    buy_price: 910181,
    sell_price: 871765,
    datetime: '08/05/22',
  },
  {
    buy_price: 911814,
    sell_price: 875604,
    datetime: '09/05/22',
  },
  {
    buy_price: 903904,
    sell_price: 867999,
    datetime: '10/05/22',
  },
  {
    buy_price: 898248,
    sell_price: 862525,
    datetime: '11/05/22',
  },
  {
    buy_price: 902371,
    sell_price: 866478,
    datetime: '12/05/22',
  },
  {
    buy_price: 890671,
    sell_price: 855223,
    datetime: '13/05/22',
  },
  {
    buy_price: 885013,
    sell_price: 849259,
    datetime: '14/05/22',
  },
  {
    buy_price: 885013,
    sell_price: 848496,
    datetime: '15/05/22',
  },
  {
    buy_price: 889508,
    sell_price: 854139,
    datetime: '16/05/22',
  },
  {
    buy_price: 894635,
    sell_price: 859091,
    datetime: '17/05/22',
  },
  {
    buy_price: 893583,
    sell_price: 858067,
    datetime: '18/05/22',
  },
  {
    buy_price: 900910,
    sell_price: 865137,
    datetime: '19/05/22',
  },
  {
    buy_price: 901513,
    sell_price: 865664,
    datetime: '20/05/22',
  },
  {
    buy_price: 903388,
    sell_price: 866379,
    datetime: '21/05/22',
  },
  {
    buy_price: 903388,
    sell_price: 865218,
    datetime: '22/05/22',
  },
  {
    buy_price: 909421,
    sell_price: 873273,
    datetime: '23/05/22',
  },
  {
    buy_price: 911280,
    sell_price: 875062,
    datetime: '24/05/22',
  },
  {
    buy_price: 911013,
    sell_price: 874738,
    datetime: '25/05/22',
  },
  {
    buy_price: 903528,
    sell_price: 867608,
    datetime: '26/05/22',
  },
  {
    buy_price: 902857,
    sell_price: 866895,
    datetime: '27/05/22',
  },
  {
    buy_price: 897808,
    sell_price: 861443,
    datetime: '28/05/22',
  },
  {
    buy_price: 897808,
    sell_price: 860439,
    datetime: '29/05/22',
  },
  {
    buy_price: 903238,
    sell_price: 867340,
    datetime: '30/05/22',
  },
  {
    buy_price: 901091,
    sell_price: 865316,
    datetime: '31/05/22',
  },
  {
    buy_price: 897514,
    sell_price: 861866,
    datetime: '01/06/22',
  },
  {
    buy_price: 899953,
    sell_price: 864227,
    datetime: '02/06/22',
  },
  {
    buy_price: 901564,
    sell_price: 865771,
    datetime: '03/06/22',
  },
  {
    buy_price: 890256,
    sell_price: 853935,
    datetime: '04/06/22',
  },
  {
    buy_price: 890256,
    sell_price: 852774,
    datetime: '05/06/22',
  },
  {
    buy_price: 893866,
    sell_price: 858410,
    datetime: '06/06/22',
  },
  {
    buy_price: 891940,
    sell_price: 856523,
    datetime: '07/06/22',
  },
  {
    buy_price: 897496,
    sell_price: 861849,
    datetime: '08/06/22',
  },
  {
    buy_price: 898969,
    sell_price: 863246,
    datetime: '09/06/22',
  },
  {
    buy_price: 912382,
    sell_price: 876180,
    datetime: '10/06/22',
  },
  {
    buy_price: 912033,
    sell_price: 875769,
    datetime: '11/06/22',
  },
  {
    buy_price: 911344,
    sell_price: 873201,
    datetime: '12/06/22',
  },
  {
    buy_price: 913926,
    sell_price: 877404,
    datetime: '13/06/22',
  },
  {
    buy_price: 899797,
    sell_price: 864068,
    datetime: '14/06/22',
  },
  {
    buy_price: 901284,
    sell_price: 865480,
    datetime: '15/06/22',
  },
  {
    buy_price: 913544,
    sell_price: 877251,
    datetime: '16/06/22',
  },
  {
    buy_price: 916554,
    sell_price: 879043,
    datetime: '17/06/22',
  },
  {
    buy_price: 909413,
    sell_price: 873273,
    datetime: '18/06/22',
  },
  {
    buy_price: 909387,
    sell_price: 871924,
    datetime: '19/06/22',
  },
  {
    buy_price: 911227,
    sell_price: 875045,
    datetime: '20/06/22',
  },
  {
    buy_price: 909619,
    sell_price: 873467,
    datetime: '21/06/22',
  },
  {
    buy_price: 912430,
    sell_price: 876180,
    datetime: '22/06/22',
  },
  {
    buy_price: 911633,
    sell_price: 875419,
    datetime: '23/06/22',
  },
  {
    buy_price: 905457,
    sell_price: 869516,
    datetime: '24/06/22',
  },
  {
    buy_price: 903770,
    sell_price: 867862,
    datetime: '25/06/22',
  },
  {
    buy_price: 903770,
    sell_price: 865143,
    datetime: '26/06/22',
  },
  {
    buy_price: 907377,
    sell_price: 871270,
    datetime: '27/06/22',
  },
  {
    buy_price: 903170,
    sell_price: 867296,
    datetime: '28/06/22',
  },
  {
    buy_price: 905456,
    sell_price: 869563,
    datetime: '29/06/22',
  },
  {
    buy_price: 906930,
    sell_price: 870916,
    datetime: '30/06/22',
  },
  {
    buy_price: 903375,
    sell_price: 867458,
    datetime: '01/07/22',
  },
  {
    buy_price: 903168,
    sell_price: 866303,
    datetime: '02/07/22',
  },
  {
    buy_price: 903168,
    sell_price: 865480,
    datetime: '03/07/22',
  },
  {
    buy_price: 904424,
    sell_price: 867945,
    datetime: '04/07/22',
  },
  {
    buy_price: 914399,
    sell_price: 878049,
    datetime: '05/07/22',
  },
  {
    buy_price: 885831,
    sell_price: 850634,
    datetime: '06/07/22',
  },
  {
    buy_price: 872829,
    sell_price: 838176,
    datetime: '07/07/22',
  },
  {
    buy_price: 872227,
    sell_price: 837521,
    datetime: '08/07/22',
  },
  {
    buy_price: 869467,
    sell_price: 834923,
    datetime: '09/07/22',
  },
  {
    buy_price: 869194,
    sell_price: 833368,
    datetime: '10/07/22',
  },
  {
    buy_price: 869572,
    sell_price: 834943,
    datetime: '11/07/22',
  },
  {
    buy_price: 868119,
    sell_price: 833629,
    datetime: '12/07/22',
  },
  {
    buy_price: 871049,
    sell_price: 836433,
    datetime: '13/07/22',
  },
  {
    buy_price: 869780,
    sell_price: 835194,
    datetime: '14/07/22',
  },
  {
    buy_price: 862127,
    sell_price: 827882,
    datetime: '15/07/22',
  },
  {
    buy_price: 853123,
    sell_price: 818282,
    datetime: '16/07/22',
  },
  {
    buy_price: 853123,
    sell_price: 817975,
    datetime: '17/07/22',
  },
  {
    buy_price: 858583,
    sell_price: 824509,
    datetime: '18/07/22',
  },
  {
    buy_price: 856157,
    sell_price: 822169,
    datetime: '19/07/22',
  },
  {
    buy_price: 855991,
    sell_price: 821363,
    datetime: '20/07/22',
  },
  {
    buy_price: 859217,
    sell_price: 825040,
    datetime: '21/07/22',
  },
  {
    buy_price: 867388,
    sell_price: 832936,
    datetime: '22/07/22',
  },
  {
    buy_price: 862038,
    sell_price: 827576,
    datetime: '23/07/22',
  },
  {
    buy_price: 862038,
    sell_price: 826088,
    datetime: '24/07/22',
  },
  {
    buy_price: 864701,
    sell_price: 830360,
    datetime: '25/07/22',
  },
  {
    buy_price: 862201,
    sell_price: 827969,
    datetime: '26/07/22',
  },
  {
    buy_price: 860726,
    sell_price: 826552,
    datetime: '27/07/22',
  },
  {
    buy_price: 870420,
    sell_price: 835824,
    datetime: '28/07/22',
  },
  {
    buy_price: 874080,
    sell_price: 839359,
    datetime: '29/07/22',
  },
  {
    buy_price: 873244,
    sell_price: 838567,
    datetime: '30/07/22',
  },
  {
    buy_price: 871847,
    sell_price: 835254,
    datetime: '31/07/22',
  },
  {
    buy_price: 878206,
    sell_price: 843312,
    datetime: '01/08/22',
  },
  {
    buy_price: 885554,
    sell_price: 850335,
    datetime: '02/08/22',
  },
  {
    buy_price: 878682,
    sell_price: 843749,
    datetime: '03/08/22',
  },
  {
    buy_price: 888607,
    sell_price: 853282,
    datetime: '04/08/22',
  },
  {
    buy_price: 891433,
    sell_price: 855999,
    datetime: '05/08/22',
  },
  {
    buy_price: 885351,
    sell_price: 848595,
    datetime: '06/08/22',
  },
  {
    buy_price: 884198,
    sell_price: 847384,
    datetime: '07/08/22',
  },
  {
    buy_price: 884198,
    sell_price: 848676,
    datetime: '08/08/22',
  },
  {
    buy_price: 889739,
    sell_price: 854373,
    datetime: '09/08/22',
  },
  {
    buy_price: 892132,
    sell_price: 856563,
    datetime: '10/08/22',
  },
  {
    buy_price: 884557,
    sell_price: 849379,
    datetime: '11/08/22',
  },
  {
    buy_price: 878815,
    sell_price: 843907,
    datetime: '12/08/22',
  },
  {
    buy_price: 879856,
    sell_price: 844465,
    datetime: '13/08/22',
  },
  {
    buy_price: 879856,
    sell_price: 843754,
    datetime: '14/08/22',
  },
  {
    buy_price: 880290,
    sell_price: 845294,
    datetime: '15/08/22',
  },
  {
    buy_price: 876180,
    sell_price: 841333,
    datetime: '16/08/22',
  },
  {
    buy_price: 873609,
    sell_price: 838856,
    datetime: '17/08/22',
  },
  {
    buy_price: 874757,
    sell_price: 840008,
    datetime: '18/08/22',
  },
  {
    buy_price: 871232,
    sell_price: 836628,
    datetime: '19/08/22',
  },
  {
    buy_price: 867731,
    sell_price: 833252,
    datetime: '20/08/22',
  },
  {
    buy_price: 866200,
    sell_price: 829257,
    datetime: '21/08/22',
  },
  {
    buy_price: 867091,
    sell_price: 832670,
    datetime: '22/08/22',
  },
  {
    buy_price: 866152,
    sell_price: 831778,
    datetime: '23/08/22',
  },
  {
    buy_price: 866980,
    sell_price: 832482,
    datetime: '24/08/22',
  },
  {
    buy_price: 870434,
    sell_price: 835862,
    datetime: '25/08/22',
  },
  {
    buy_price: 867006,
    sell_price: 832579,
    datetime: '26/08/22',
  },
  {
    buy_price: 860049,
    sell_price: 825209,
    datetime: '27/08/22',
  },
  {
    buy_price: 860049,
    sell_price: 823938,
    datetime: '28/08/22',
  },
  {
    buy_price: 864160,
    sell_price: 829818,
    datetime: '29/08/22',
  },
  {
    buy_price: 863162,
    sell_price: 828853,
    datetime: '30/08/22',
  },
  {
    buy_price: 853260,
    sell_price: 819387,
    datetime: '31/08/22',
  },
  {
    buy_price: 847978,
    sell_price: 814281,
    datetime: '01/09/22',
  },
  {
    buy_price: 849966,
    sell_price: 816229,
    datetime: '02/09/22',
  },
  {
    buy_price: 850902,
    sell_price: 817117,
    datetime: '03/09/22',
  },
  {
    buy_price: 849236,
    sell_price: 814370,
    datetime: '04/09/22',
  },
  {
    buy_price: 851511,
    sell_price: 817654,
    datetime: '05/09/22',
  },
  {
    buy_price: 854715,
    sell_price: 820765,
    datetime: '06/09/22',
  },
  {
    buy_price: 850964,
    sell_price: 817153,
    datetime: '07/09/22',
  },
  {
    buy_price: 856544,
    sell_price: 822508,
    datetime: '08/09/22',
  },
  {
    buy_price: 856080,
    sell_price: 822105,
    datetime: '09/09/22',
  },
  {
    buy_price: 848874,
    sell_price: 815152,
    datetime: '10/09/22',
  },
  {
    buy_price: 848719,
    sell_price: 812935,
    datetime: '11/09/22',
  },
  {
    buy_price: 856777,
    sell_price: 828489,
    datetime: '12/09/22',
  },
  {
    buy_price: 855105,
    sell_price: 826887,
    datetime: '13/09/22',
  },
  {
    buy_price: 848141,
    sell_price: 820103,
    datetime: '14/09/22',
  },
  {
    buy_price: 842679,
    sell_price: 814889,
    datetime: '15/09/22',
  },
  {
    buy_price: 835723,
    sell_price: 808118,
    datetime: '16/09/22',
  },
  {
    buy_price: 835851,
    sell_price: 807920,
    datetime: '17/09/22',
  },
  {
    buy_price: 835851,
    sell_price: 806279,
    datetime: '18/09/22',
  },
  {
    buy_price: 837326,
    sell_price: 809648,
    datetime: '19/09/22',
  },
  {
    buy_price: 836916,
    sell_price: 809277,
    datetime: '20/09/22',
  },
  {
    buy_price: 836318,
    sell_price: 808693,
    datetime: '21/09/22',
  },
  {
    buy_price: 842771,
    sell_price: 814905,
    datetime: '22/09/22',
  },
  {
    buy_price: 837095,
    sell_price: 809435,
    datetime: '23/09/22',
  },
  {
    buy_price: 826802,
    sell_price: 799464,
    datetime: '24/09/22',
  },
  {
    buy_price: 826802,
    sell_price: 797270,
    datetime: '25/09/22',
  },
  {
    buy_price: 828827,
    sell_price: 801453,
    datetime: '26/09/22',
  },
  {
    buy_price: 827306,
    sell_price: 800009,
    datetime: '27/09/22',
  },
  {
    buy_price: 840448,
    sell_price: 812699,
    datetime: '28/09/22',
  },
  {
    buy_price: 840504,
    sell_price: 812807,
    datetime: '29/09/22',
  },
  {
    buy_price: 850737,
    sell_price: 822660,
    datetime: '30/09/22',
  },
  {
    buy_price: 845936,
    sell_price: 818045,
    datetime: '01/10/22',
  },
  {
    buy_price: 845747,
    sell_price: 816594,
    datetime: '02/10/22',
  },
  {
    buy_price: 860337,
    sell_price: 831939,
    datetime: '03/10/22',
  },
  {
    buy_price: 872584,
    sell_price: 843773,
    datetime: '04/10/22',
  },
  {
    buy_price: 873333,
    sell_price: 844494,
    datetime: '05/10/22',
  },
  {
    buy_price: 872363,
    sell_price: 843559,
    datetime: '06/10/22',
  },
  {
    buy_price: 869415,
    sell_price: 840733,
    datetime: '07/10/22',
  },
  {
    buy_price: 864774,
    sell_price: 836265,
    datetime: '08/10/22',
  },
  {
    buy_price: 862816,
    sell_price: 831947,
    datetime: '09/10/22',
  },
  {
    buy_price: 864173,
    sell_price: 835599,
    datetime: '10/10/22',
  },
  {
    buy_price: 858458,
    sell_price: 830092,
    datetime: '11/10/22',
  },
  {
    buy_price: 855899,
    sell_price: 827662,
    datetime: '12/10/22',
  },
  {
    buy_price: 858183,
    sell_price: 829825,
    datetime: '13/10/22',
  },
  {
    buy_price: 855984,
    sell_price: 827728,
    datetime: '14/10/22',
  },
  {
    buy_price: 846773,
    sell_price: 818049,
    datetime: '15/10/22',
  },
  {
    buy_price: 846773,
    sell_price: 817457,
    datetime: '16/10/22',
  },
  {
    buy_price: 858179,
    sell_price: 829865,
    datetime: '17/10/22',
  },
  {
    buy_price: 852390,
    sell_price: 824227,
    datetime: '18/10/22',
  },
  {
    buy_price: 852297,
    sell_price: 824157,
    datetime: '19/10/22',
  },
  {
    buy_price: 849504,
    sell_price: 821439,
    datetime: '20/10/22',
  },
  {
    buy_price: 855506,
    sell_price: 827267,
    datetime: '21/10/22',
  },
  {
    buy_price: 859298,
    sell_price: 828085,
    datetime: '22/10/22',
  },
  {
    buy_price: 859298,
    sell_price: 826861,
    datetime: '23/10/22',
  },
  {
    buy_price: 867387,
    sell_price: 838769,
    datetime: '24/10/22',
  },
  {
    buy_price: 860764,
    sell_price: 832360,
    datetime: '25/10/22',
  },
  {
    buy_price: 867260,
    sell_price: 837816,
    datetime: '26/10/22',
  },
  {
    buy_price: 863965,
    sell_price: 835435,
    datetime: '27/10/22',
  },
  {
    buy_price: 862126,
    sell_price: 833702,
    datetime: '28/10/22',
  },
  {
    buy_price: 853156,
    sell_price: 823098,
    datetime: '29/10/22',
  },
  {
    buy_price: 851509,
    sell_price: 822148,
    datetime: '30/10/22',
  },
  {
    buy_price: 854728,
    sell_price: 826496,
    datetime: '31/10/22',
  },
  {
    buy_price: 860504,
    sell_price: 832102,
    datetime: '01/11/22',
  },
  {
    buy_price: 862639,
    sell_price: 834172,
    datetime: '02/11/22',
  },
  {
    buy_price: 864792,
    sell_price: 836200,
    datetime: '03/11/22',
  },
  {
    buy_price: 871482,
    sell_price: 842730,
    datetime: '04/11/22',
  },
  {
    buy_price: 880857,
    sell_price: 849746,
    datetime: '05/11/22',
  },
  {
    buy_price: 873950,
    sell_price: 843083,
    datetime: '06/11/22',
  },
  {
    buy_price: 876535,
    sell_price: 847581,
    datetime: '07/11/22',
  },
  {
    buy_price: 891093,
    sell_price: 861667,
    datetime: '08/11/22',
  },
  {
    buy_price: 895773,
    sell_price: 866223,
    datetime: '09/11/22',
  },
  {
    buy_price: 912188,
    sell_price: 882137,
    datetime: '10/11/22',
  },
  {
    buy_price: 911069,
    sell_price: 881007,
    datetime: '11/11/22',
  },
  {
    buy_price: 925895,
    sell_price: 893232,
    datetime: '12/11/22',
  },
  {
    buy_price: 912205,
    sell_price: 880876,
    datetime: '13/11/22',
  },
  {
    buy_price: 918432,
    sell_price: 888137,
    datetime: '14/11/22',
  },
  {
    buy_price: 922546,
    sell_price: 892106,
    datetime: '15/11/22',
  },
  {
    buy_price: 925637,
    sell_price: 895114,
    datetime: '16/11/22',
  },
  {
    buy_price: 924842,
    sell_price: 893746,
    datetime: '17/11/22',
  },
  {
    buy_price: 922452,
    sell_price: 892038,
    datetime: '18/11/22',
  },
  {
    buy_price: 914403,
    sell_price: 882864,
    datetime: '19/11/22',
  },
  {
    buy_price: 911688,
    sell_price: 879209,
    datetime: '20/11/22',
  },
  {
    buy_price: 913272,
    sell_price: 883115,
    datetime: '21/11/22',
  },
  {
    buy_price: 912373,
    sell_price: 882265,
    datetime: '22/11/22',
  },
  {
    buy_price: 910312,
    sell_price: 880303,
    datetime: '23/11/22',
  },
  {
    buy_price: 915467,
    sell_price: 885264,
    datetime: '24/11/22',
  },
  {
    buy_price: 916923,
    sell_price: 886696,
    datetime: '25/11/22',
  },
  {
    buy_price: 916779,
    sell_price: 886245,
    datetime: '26/11/22',
  },
  {
    buy_price: 916862,
    sell_price: 886325,
    datetime: '27/11/22',
  },
  {
    buy_price: 921661,
    sell_price: 891268,
    datetime: '28/11/22',
  },
  {
    buy_price: 919767,
    sell_price: 889427,
    datetime: '29/11/22',
  },
  {
    buy_price: 921119,
    sell_price: 890714,
    datetime: '30/11/22',
  },
  {
    buy_price: 926086,
    sell_price: 895515,
    datetime: '01/12/22',
  },
  {
    buy_price: 924844,
    sell_price: 894329,
    datetime: '02/12/22',
  },
  {
    buy_price: 922878,
    sell_price: 891231,
    datetime: '03/12/22',
  },
  {
    buy_price: 922878,
    sell_price: 891231,
    datetime: '04/12/22',
  },
  {
    buy_price: 927892,
    sell_price: 897252,
    datetime: '05/12/22',
  },
  {
    buy_price: 925927,
    sell_price: 895364,
    datetime: '06/12/22',
  },
  {
    buy_price: 926898,
    sell_price: 896328,
    datetime: '07/12/22',
  },
  {
    buy_price: 930413,
    sell_price: 899734,
    datetime: '08/12/22',
  },
  {
    buy_price: 935672,
    sell_price: 904790,
    datetime: '09/12/22',
  },
  {
    buy_price: 934994,
    sell_price: 904104,
    datetime: '10/12/22',
  },
  {
    buy_price: 932780,
    sell_price: 901300,
    datetime: '11/12/22',
  },
  {
    buy_price: 934626,
    sell_price: 902929,
    datetime: '12/12/22',
  },
  {
    buy_price: 943961,
    sell_price: 911944,
    datetime: '13/12/22',
  },
  {
    buy_price: 942574,
    sell_price: 910584,
    datetime: '14/12/22',
  },
  {
    buy_price: 938918,
    sell_price: 907022,
    datetime: '15/12/22',
  },
  {
    buy_price: 930702,
    sell_price: 899978,
    datetime: '16/12/22',
  },
  {
    buy_price: 931938,
    sell_price: 901239,
    datetime: '17/12/22',
  },
  {
    buy_price: 931400,
    sell_price: 899448,
    datetime: '18/12/22',
  },
  {
    buy_price: 932527,
    sell_price: 901748,
    datetime: '19/12/22',
  },
  {
    buy_price: 943317,
    sell_price: 912198,
    datetime: '20/12/22',
  },
  {
    buy_price: 943886,
    sell_price: 912748,
    datetime: '21/12/22',
  },
  {
    buy_price: 943555,
    sell_price: 912403,
    datetime: '22/12/22',
  },
  {
    buy_price: 934779,
    sell_price: 903961,
    datetime: '23/12/22',
  },
  {
    buy_price: 933711,
    sell_price: 902843,
    datetime: '24/12/22',
  },
  {
    buy_price: 932161,
    sell_price: 900236,
    datetime: '25/12/22',
  },
  {
    buy_price: 935840,
    sell_price: 904267,
    datetime: '26/12/22',
  },
  {
    buy_price: 952898,
    sell_price: 921434,
    datetime: '27/12/22',
  },
  {
    buy_price: 948344,
    sell_price: 917073,
    datetime: '28/12/22',
  },
  {
    buy_price: 949493,
    sell_price: 918144,
    datetime: '29/12/22',
  },
  {
    buy_price: 946086,
    sell_price: 914875,
    datetime: '30/12/22',
  },
  {
    buy_price: 945055,
    sell_price: 912668,
    datetime: '31/12/22',
  },
  {
    buy_price: 943264,
    sell_price: 910049,
    datetime: '01/01/23',
  },
  {
    buy_price: 946988,
    sell_price: 913642,
    datetime: '02/01/23',
  },
  {
    buy_price: 959755,
    sell_price: 928141,
    datetime: '03/01/23',
  },
  {
    buy_price: 965467,
    sell_price: 933660,
    datetime: '04/01/23',
  },
  {
    buy_price: 964442,
    sell_price: 932644,
    datetime: '05/01/23',
  },
  {
    buy_price: 967446,
    sell_price: 935503,
    datetime: '06/01/23',
  },
  {
    buy_price: 970500,
    sell_price: 938286,
    datetime: '07/01/23',
  },
  {
    buy_price: 968905,
    sell_price: 935560,
    datetime: '08/01/23',
  },
  {
    buy_price: 973938,
    sell_price: 941857,
    datetime: '09/01/23',
  },
  {
    buy_price: 972071,
    sell_price: 939951,
    datetime: '10/01/23',
  },
  {
    buy_price: 971660,
    sell_price: 939600,
    datetime: '11/01/23',
  },
  {
    buy_price: 967422,
    sell_price: 935501,
    datetime: '12/01/23',
  },
  {
    buy_price: 964464,
    sell_price: 932672,
    datetime: '13/01/23',
  },
  {
    buy_price: 979900,
    sell_price: 946214,
    datetime: '14/01/23',
  },
  {
    buy_price: 966915,
    sell_price: 933674,
    datetime: '15/01/23',
  },
  {
    buy_price: 966935,
    sell_price: 935052,
    datetime: '16/01/23',
  },
  {
    buy_price: 967289,
    sell_price: 935409,
    datetime: '17/01/23',
  },
  {
    buy_price: 964756,
    sell_price: 932958,
    datetime: '18/01/23',
  },
  {
    buy_price: 970249,
    sell_price: 938316,
    datetime: '19/01/23',
  },
  {
    buy_price: 975148,
    sell_price: 943022,
    datetime: '20/01/23',
  },
  {
    buy_price: 966284,
    sell_price: 934418,
    datetime: '21/01/23',
  },
  {
    buy_price: 965224,
    sell_price: 932052,
    datetime: '22/01/23',
  },
  {
    buy_price: 968651,
    sell_price: 936716,
    datetime: '23/01/23',
  },
  {
    buy_price: 968249,
    sell_price: 936304,
    datetime: '24/01/23',
  },
  {
    buy_price: 964659,
    sell_price: 932842,
    datetime: '25/01/23',
  },
  {
    buy_price: 969522,
    sell_price: 937565,
    datetime: '26/01/23',
  },
  {
    buy_price: 963864,
    sell_price: 932073,
    datetime: '27/01/23',
  },
  {
    buy_price: 962174,
    sell_price: 930482,
    datetime: '28/01/23',
  },
  {
    buy_price: 960581,
    sell_price: 927570,
    datetime: '29/01/23',
  },
  {
    buy_price: 963056,
    sell_price: 931287,
    datetime: '30/01/23',
  },
  {
    buy_price: 964776,
    sell_price: 932970,
    datetime: '31/01/23',
  },
  {
    buy_price: 965393,
    sell_price: 933571,
    datetime: '01/02/23',
  },
  {
    buy_price: 970512,
    sell_price: 938498,
    datetime: '02/02/23',
  },
  {
    buy_price: 952077,
    sell_price: 920655,
    datetime: '03/02/23',
  },
  {
    buy_price: 936651,
    sell_price: 905682,
    datetime: '04/02/23',
  },
  {
    buy_price: 936651,
    sell_price: 904415,
    datetime: '05/02/23',
  },
  {
    buy_price: 947695,
    sell_price: 916449,
    datetime: '06/02/23',
  },
  {
    buy_price: 947982,
    sell_price: 916732,
    datetime: '07/02/23',
  },
  {
    buy_price: 949764,
    sell_price: 918421,
    datetime: '08/02/23',
  },
  {
    buy_price: 949402,
    sell_price: 918124,
    datetime: '09/02/23',
  },
  {
    buy_price: 943805,
    sell_price: 912697,
    datetime: '10/02/23',
  },
  {
    buy_price: 942703,
    sell_price: 910915,
    datetime: '11/02/23',
  },
  {
    buy_price: 942688,
    sell_price: 910244,
    datetime: '12/02/23',
  },
  {
    buy_price: 944538,
    sell_price: 913386,
    datetime: '13/02/23',
  },
  {
    buy_price: 941167,
    sell_price: 910029,
    datetime: '14/02/23',
  },
  {
    buy_price: 939042,
    sell_price: 908115,
    datetime: '15/02/23',
  },
  {
    buy_price: 930802,
    sell_price: 900088,
    datetime: '16/02/23',
  },
  {
    buy_price: 929263,
    sell_price: 898569,
    datetime: '17/02/23',
  },
  {
    buy_price: 931197,
    sell_price: 900480,
    datetime: '18/02/23',
  },
  {
    buy_price: 930599,
    sell_price: 898555,
    datetime: '19/02/23',
  },
  {
    buy_price: 930940,
    sell_price: 900236,
    datetime: '20/02/23',
  },
  {
    buy_price: 931709,
    sell_price: 900949,
    datetime: '21/02/23',
  },
  {
    buy_price: 932128,
    sell_price: 901399,
    datetime: '22/02/23',
  },
  {
    buy_price: 926602,
    sell_price: 896006,
    datetime: '23/02/23',
  },
  {
    buy_price: 925401,
    sell_price: 894898,
    datetime: '24/02/23',
  },
  {
    buy_price: 920222,
    sell_price: 889884,
    datetime: '25/02/23',
  },
  {
    buy_price: 919718,
    sell_price: 888268,
    datetime: '26/02/23',
  },
  {
    buy_price: 922555,
    sell_price: 892155,
    datetime: '27/02/23',
  },
  {
    buy_price: 926591,
    sell_price: 896024,
    datetime: '28/02/23',
  },
  {
    buy_price: 935424,
    sell_price: 904567,
    datetime: '01/03/23',
  },
  {
    buy_price: 936310,
    sell_price: 905438,
    datetime: '02/03/23',
  },
  {
    buy_price: 942270,
    sell_price: 911187,
    datetime: '03/03/23',
  },
  {
    buy_price: 943667,
    sell_price: 912360,
    datetime: '04/03/23',
  },
  {
    buy_price: 944632,
    sell_price: 912360,
    datetime: '05/03/23',
  },
  {
    buy_price: 946543,
    sell_price: 915339,
    datetime: '06/03/23',
  },
  {
    buy_price: 946133,
    sell_price: 914963,
    datetime: '07/03/23',
  },
  {
    buy_price: 935028,
    sell_price: 904208,
    datetime: '08/03/23',
  },
  {
    buy_price: 942614,
    sell_price: 911533,
    datetime: '09/03/23',
  },
  {
    buy_price: 958200,
    sell_price: 926588,
    datetime: '10/03/23',
  },
  {
    buy_price: 962997,
    sell_price: 931160,
    datetime: '11/03/23',
  },
  {
    buy_price: 962969,
    sell_price: 930512,
    datetime: '12/03/23',
  },
  {
    buy_price: 977904,
    sell_price: 945654,
    datetime: '13/03/23',
  },
  {
    buy_price: 981136,
    sell_price: 948513,
    datetime: '14/03/23',
  },
  {
    buy_price: 996436,
    sell_price: 963586,
    datetime: '15/03/23',
  },
  {
    buy_price: 996084,
    sell_price: 963241,
    datetime: '16/03/23',
  },
  {
    buy_price: 1003289,
    sell_price: 970233,
    datetime: '17/03/23',
  },
  {
    buy_price: 1017343,
    sell_price: 982667,
    datetime: '18/03/23',
  },
  {
    buy_price: 1017251,
    sell_price: 982515,
    datetime: '19/03/23',
  },
  {
    buy_price: 1026602,
    sell_price: 992737,
    datetime: '20/03/23',
  },
  {
    buy_price: 1012780,
    sell_price: 979384,
    datetime: '21/03/23',
  },
  {
    buy_price: 990355,
    sell_price: 957682,
    datetime: '22/03/23',
  },
  {
    buy_price: 1001200,
    sell_price: 968170,
    datetime: '23/03/23',
  },
  {
    buy_price: 1011055,
    sell_price: 977726,
    datetime: '24/03/23',
  },
  {
    buy_price: 1002573,
    sell_price: 969519,
    datetime: '25/03/23',
  },
  {
    buy_price: 997738,
    sell_price: 964169,
    datetime: '26/03/23',
  },
  {
    buy_price: 998502,
    sell_price: 965552,
    datetime: '27/03/23',
  },
  {
    buy_price: 986919,
    sell_price: 954384,
    datetime: '28/03/23',
  },
  {
    buy_price: 988957,
    sell_price: 956317,
    datetime: '29/03/23',
  },
  {
    buy_price: 991762,
    sell_price: 959053,
    datetime: '30/03/23',
  },
  {
    buy_price: 991458,
    sell_price: 958774,
    datetime: '31/03/23',
  },
  {
    buy_price: 982676,
    sell_price: 950242,
    datetime: '01/04/23',
  },
  {
    buy_price: 980138,
    sell_price: 947159,
    datetime: '02/04/23',
  },
  {
    buy_price: 990244,
    sell_price: 957634,
    datetime: '03/04/23',
  },
  {
    buy_price: 1014569,
    sell_price: 981167,
    datetime: '04/04/23',
  },
  {
    buy_price: 1008654,
    sell_price: 975454,
    datetime: '05/04/23',
  },
  {
    buy_price: 1007345,
    sell_price: 974207,
    datetime: '06/04/23',
  },
  {
    buy_price: 998573,
    sell_price: 965637,
    datetime: '07/04/23',
  },
  {
    buy_price: 998289,
    sell_price: 964444,
    datetime: '08/04/23',
  },
  {
    buy_price: 997816,
    sell_price: 963986,
    datetime: '09/04/23',
  },
  {
    buy_price: 997816,
    sell_price: 963986,
    datetime: '10/04/23',
  },
  {
    buy_price: 994981,
    sell_price: 962202,
    datetime: '11/04/23',
  },
  {
    buy_price: 999597,
    sell_price: 966565,
    datetime: '12/04/23',
  },
  {
    buy_price: 1002486,
    sell_price: 969437,
    datetime: '13/04/23',
  },
  {
    buy_price: 1001941,
    sell_price: 968909,
    datetime: '14/04/23',
  },
  {
    buy_price: 986639,
    sell_price: 954115,
    datetime: '15/04/23',
  },
  {
    buy_price: 985286,
    sell_price: 952265,
    datetime: '16/04/23',
  },
  {
    buy_price: 1000736,
    sell_price: 967762,
    datetime: '17/04/23',
  },
  {
    buy_price: 995822,
    sell_price: 963029,
    datetime: '18/04/23',
  },
  {
    buy_price: 994676,
    sell_price: 961878,
    datetime: '19/04/23',
  },
  {
    buy_price: 999598,
    sell_price: 966642,
    datetime: '20/04/23',
  },
  {
    buy_price: 997349,
    sell_price: 964443,
    datetime: '21/04/23',
  },
  {
    buy_price: 985768,
    sell_price: 953262,
    datetime: '22/04/23',
  },
  {
    buy_price: 985652,
    sell_price: 952093,
    datetime: '23/04/23',
  },
  {
    buy_price: 987480,
    sell_price: 954918,
    datetime: '24/04/23',
  },
  {
    buy_price: 994292,
    sell_price: 961487,
    datetime: '25/04/23',
  },
  {
    buy_price: 995931,
    sell_price: 963105,
    datetime: '26/04/23',
  },
  {
    buy_price: 983907,
    sell_price: 951463,
    datetime: '27/04/23',
  },
  {
    buy_price: 973293,
    sell_price: 941190,
    datetime: '28/04/23',
  },
  {
    buy_price: 971959,
    sell_price: 939956,
    datetime: '29/04/23',
  },
  {
    buy_price: 971211,
    sell_price: 938568,
    datetime: '30/04/23',
  },
  {
    buy_price: 977401,
    sell_price: 945191,
    datetime: '01/05/23',
  },
  {
    buy_price: 989869,
    sell_price: 957201,
    datetime: '02/05/23',
  },
  {
    buy_price: 989375,
    sell_price: 956717,
    datetime: '03/05/23',
  },
  {
    buy_price: 1011828,
    sell_price: 976074,
    datetime: '04/05/23',
  },
  {
    buy_price: 1003615,
    sell_price: 970520,
    datetime: '05/05/23',
  },
  {
    buy_price: 985264,
    sell_price: 952739,
    datetime: '06/05/23',
  },
  {
    buy_price: 984378,
    sell_price: 951193,
    datetime: '07/05/23',
  },
  {
    buy_price: 992595,
    sell_price: 959861,
    datetime: '08/05/23',
  },
  {
    buy_price: 996392,
    sell_price: 963524,
    datetime: '09/05/23',
  },
  {
    buy_price: 1001060,
    sell_price: 968038,
    datetime: '10/05/23',
  },
  {
    buy_price: 998631,
    sell_price: 965713,
    datetime: '11/05/23',
  },
  {
    buy_price: 996235,
    sell_price: 963405,
    datetime: '12/05/23',
  },
  {
    buy_price: 995046,
    sell_price: 962211,
    datetime: '13/05/23',
  },
  {
    buy_price: 992994,
    sell_price: 959979,
    datetime: '14/05/23',
  },
  {
    buy_price: 995092,
    sell_price: 962285,
    datetime: '15/05/23',
  },
  {
    buy_price: 994259,
    sell_price: 961484,
    datetime: '16/05/23',
  },
  {
    buy_price: 985952,
    sell_price: 953412,
    datetime: '17/05/23',
  },
  {
    buy_price: 981337,
    sell_price: 948963,
    datetime: '18/05/23',
  },
  {
    buy_price: 984289,
    sell_price: 951832,
    datetime: '19/05/23',
  },
  {
    buy_price: 984015,
    sell_price: 951567,
    datetime: '20/05/23',
  },
  {
    buy_price: 982321,
    sell_price: 949294,
    datetime: '21/05/23',
  },
  {
    buy_price: 983939,
    sell_price: 951479,
    datetime: '22/05/23',
  },
  {
    buy_price: 979520,
    sell_price: 947210,
    datetime: '23/05/23',
  },
  {
    buy_price: 982525,
    sell_price: 950130,
    datetime: '24/05/23',
  },
  {
    buy_price: 976699,
    sell_price: 944491,
    datetime: '25/05/23',
  },
  {
    buy_price: 974085,
    sell_price: 941954,
    datetime: '26/05/23',
  },
  {
    buy_price: 971676,
    sell_price: 939382,
    datetime: '27/05/23',
  },
  {
    buy_price: 971676,
    sell_price: 938538,
    datetime: '28/05/23',
  },
  {
    buy_price: 971825,
    sell_price: 939035,
    datetime: '29/05/23',
  },
  {
    buy_price: 977955,
    sell_price: 945716,
    datetime: '30/05/23',
  },
  {
    buy_price: 984393,
    sell_price: 951937,
    datetime: '31/05/23',
  },
  {
    buy_price: 982776,
    sell_price: 950374,
    datetime: '01/06/23',
  },
  {
    buy_price: 980989,
    sell_price: 948660,
    datetime: '02/06/23',
  },
  {
    buy_price: 965852,
    sell_price: 934025,
    datetime: '03/06/23',
  },
  {
    buy_price: 965572,
    sell_price: 933597,
    datetime: '04/06/23',
  },
  {
    buy_price: 971555,
    sell_price: 939521,
    datetime: '05/06/23',
  },
  {
    buy_price: 972247,
    sell_price: 940237,
    datetime: '06/06/23',
  },
  {
    buy_price: 972583,
    sell_price: 940506,
    datetime: '07/06/23',
  },
  {
    buy_price: 972675,
    sell_price: 940635,
    datetime: '08/06/23',
  },
  {
    buy_price: 972264,
    sell_price: 940194,
    datetime: '09/06/23',
  },
  {
    buy_price: 971074,
    sell_price: 938950,
    datetime: '10/06/23',
  },
  {
    buy_price: 971074,
    sell_price: 938329,
    datetime: '11/06/23',
  },
  {
    buy_price: 971955,
    sell_price: 939928,
    datetime: '12/06/23',
  },
  {
    buy_price: 972845,
    sell_price: 940625,
    datetime: '13/06/23',
  },
  {
    buy_price: 970209,
    sell_price: 938191,
    datetime: '14/06/23',
  },
  {
    buy_price: 972243,
    sell_price: 940162,
    datetime: '15/06/23',
  },
  {
    buy_price: 977265,
    sell_price: 945049,
    datetime: '16/06/23',
  },
  {
    buy_price: 974633,
    sell_price: 942432,
    datetime: '17/06/23',
  },
  {
    buy_price: 974077,
    sell_price: 941171,
    datetime: '18/06/23',
  },
  {
    buy_price: 976531,
    sell_price: 944319,
    datetime: '19/06/23',
  },
  {
    buy_price: 976897,
    sell_price: 944687,
    datetime: '20/06/23',
  },
  {
    buy_price: 968757,
    sell_price: 936766,
    datetime: '21/06/23',
  },
  {
    buy_price: 962529,
    sell_price: 930787,
    datetime: '22/06/23',
  },
  {
    buy_price: 968108,
    sell_price: 936098,
    datetime: '23/06/23',
  },
  {
    buy_price: 961860,
    sell_price: 930174,
    datetime: '24/06/23',
  },
  {
    buy_price: 960880,
    sell_price: 928819,
    datetime: '25/06/23',
  },
  {
    buy_price: 968031,
    sell_price: 936128,
    datetime: '26/06/23',
  },
  {
    buy_price: 963882,
    sell_price: 932109,
    datetime: '27/06/23',
  },
  {
    buy_price: 957258,
    sell_price: 925621,
    datetime: '28/06/23',
  },
  {
    buy_price: 957556,
    sell_price: 925972,
    datetime: '29/06/23',
  },
  {
    buy_price: 960145,
    sell_price: 928462,
    datetime: '30/06/23',
  },
  {
    buy_price: 960966,
    sell_price: 929271,
    datetime: '01/07/23',
  },
  {
    buy_price: 960166,
    sell_price: 928032,
    datetime: '02/07/23',
  },
  {
    buy_price: 965294,
    sell_price: 933451,
    datetime: '03/07/23',
  },
  {
    buy_price: 963417,
    sell_price: 931655,
    datetime: '04/07/23',
  },
  {
    buy_price: 968292,
    sell_price: 936413,
    datetime: '05/07/23',
  },
  {
    buy_price: 965830,
    sell_price: 934007,
    datetime: '06/07/23',
  },
  {
    buy_price: 974684,
    sell_price: 942600,
    datetime: '07/07/23',
  },
  {
    buy_price: 972323,
    sell_price: 940312,
    datetime: '08/07/23',
  },
  {
    buy_price: 970577,
    sell_price: 937999,
    datetime: '09/07/23',
  },
  {
    buy_price: 975371,
    sell_price: 943200,
    datetime: '10/07/23',
  },
  {
    buy_price: 977381,
    sell_price: 945169,
    datetime: '11/07/23',
  },
  {
    buy_price: 975198,
    sell_price: 943029,
    datetime: '12/07/23',
  },
  {
    buy_price: 977761,
    sell_price: 945518,
    datetime: '13/07/23',
  },
  {
    buy_price: 976884,
    sell_price: 944694,
    datetime: '14/07/23',
  },
  {
    buy_price: 976433,
    sell_price: 944243,
    datetime: '15/07/23',
  },
  {
    buy_price: 975585,
    sell_price: 942835,
    datetime: '16/07/23',
  },
  {
    buy_price: 978453,
    sell_price: 946216,
    datetime: '17/07/23',
  },
  {
    buy_price: 987773,
    sell_price: 955236,
    datetime: '18/07/23',
  },
  {
    buy_price: 988637,
    sell_price: 956036,
    datetime: '19/07/23',
  },
  {
    buy_price: 990651,
    sell_price: 958016,
    datetime: '20/07/23',
  },
  {
    buy_price: 987506,
    sell_price: 954932,
    datetime: '21/07/23',
  },
  {
    buy_price: 982058,
    sell_price: 949692,
    datetime: '22/07/23',
  },
  {
    buy_price: 981384,
    sell_price: 948505,
    datetime: '23/07/23',
  },
  {
    buy_price: 983976,
    sell_price: 951552,
    datetime: '24/07/23',
  },
  {
    buy_price: 981684,
    sell_price: 949331,
    datetime: '25/07/23',
  },
  {
    buy_price: 988228,
    sell_price: 955675,
    datetime: '26/07/23',
  },
  {
    buy_price: 988811,
    sell_price: 956209,
    datetime: '27/07/23',
  },
  {
    buy_price: 983905,
    sell_price: 951350,
    datetime: '28/07/23',
  },
  {
    buy_price: 984417,
    sell_price: 951744,
    datetime: '29/07/23',
  },
  {
    buy_price: 984384,
    sell_price: 951389,
    datetime: '30/07/23',
  },
  {
    buy_price: 989375,
    sell_price: 956779,
    datetime: '31/07/23',
  },
  {
    buy_price: 989055,
    sell_price: 956459,
    datetime: '01/08/23',
  },
  {
    buy_price: 986040,
    sell_price: 953539,
    datetime: '02/08/23',
  },
  {
    buy_price: 980548,
    sell_price: 948210,
    datetime: '03/08/23',
  },
  {
    buy_price: 979803,
    sell_price: 947488,
    datetime: '04/08/23',
  },
  {
    buy_price: 979142,
    sell_price: 946653,
    datetime: '05/08/23',
  },
  {
    buy_price: 979142,
    sell_price: 946238,
    datetime: '06/08/23',
  },
  {
    buy_price: 981064,
    sell_price: 948711,
    datetime: '07/08/23',
  },
  {
    buy_price: 981488,
    sell_price: 949131,
    datetime: '08/08/23',
  },
  {
    buy_price: 976212,
    sell_price: 944049,
    datetime: '09/08/23',
  },
  {
    buy_price: 972646,
    sell_price: 940478,
    datetime: '10/08/23',
  },
  {
    buy_price: 976651,
    sell_price: 944178,
    datetime: '11/08/23',
  },
  {
    buy_price: 975954,
    sell_price: 943773,
    datetime: '12/08/23',
  },
  {
    buy_price: 975141,
    sell_price: 942544,
    datetime: '13/08/23',
  },
  {
    buy_price: 975670,
    sell_price: 943475,
    datetime: '14/08/23',
  },
  {
    buy_price: 974861,
    sell_price: 942736,
    datetime: '15/08/23',
  },
  {
    buy_price: 970766,
    sell_price: 938746,
    datetime: '16/08/23',
  },
  {
    buy_price: 970232,
    sell_price: 938229,
    datetime: '17/08/23',
  },
  {
    buy_price: 967674,
    sell_price: 935756,
    datetime: '18/08/23',
  },
  {
    buy_price: 962971,
    sell_price: 931212,
    datetime: '19/08/23',
  },
  {
    buy_price: 962652,
    sell_price: 930402,
    datetime: '20/08/23',
  },
  {
    buy_price: 967355,
    sell_price: 935458,
    datetime: '21/08/23',
  },
  {
    buy_price: 970127,
    sell_price: 938143,
    datetime: '22/08/23',
  },
  {
    buy_price: 976717,
    sell_price: 944516,
    datetime: '23/08/23',
  },
  {
    buy_price: 978778,
    sell_price: 946485,
    datetime: '24/08/23',
  },
  {
    buy_price: 977407,
    sell_price: 945198,
    datetime: '25/08/23',
  },
  {
    buy_price: 974543,
    sell_price: 941795,
    datetime: '26/08/23',
  },
  {
    buy_price: 974537,
    sell_price: 941764,
    datetime: '27/08/23',
  },
  {
    buy_price: 976192,
    sell_price: 944004,
    datetime: '28/08/23',
  },
  {
    buy_price: 980046,
    sell_price: 947717,
    datetime: '29/08/23',
  },
  {
    buy_price: 984408,
    sell_price: 951965,
    datetime: '30/08/23',
  },
  {
    buy_price: 986778,
    sell_price: 954241,
    datetime: '31/08/23',
  },
  {
    buy_price: 988415,
    sell_price: 955732,
    datetime: '01/09/23',
  },
  {
    buy_price: 986812,
    sell_price: 954264,
    datetime: '02/09/23',
  },
  {
    buy_price: 982149,
    sell_price: 949153,
    datetime: '03/09/23',
  },
  {
    buy_price: 986421,
    sell_price: 953916,
    datetime: '04/09/23',
  },
  {
    buy_price: 983856,
    sell_price: 951406,
    datetime: '05/09/23',
  },
  {
    buy_price: 982378,
    sell_price: 949495,
    datetime: '06/09/23',
  },
  {
    buy_price: 980396,
    sell_price: 948079,
    datetime: '07/09/23',
  },
  {
    buy_price: 984699,
    sell_price: 952256,
    datetime: '08/09/23',
  },
  {
    buy_price: 981666,
    sell_price: 949312,
    datetime: '09/09/23',
  },
  {
    buy_price: 981454,
    sell_price: 948608,
    datetime: '10/09/23',
  },
  {
    buy_price: 985254,
    sell_price: 952787,
    datetime: '11/09/23',
  },
  {
    buy_price: 982630,
    sell_price: 950235,
    datetime: '12/09/23',
  },
  {
    buy_price: 978605,
    sell_price: 946312,
    datetime: '13/09/23',
  },
  {
    buy_price: 978004,
    sell_price: 945771,
    datetime: '14/09/23',
  },
  {
    buy_price: 986168,
    sell_price: 953701,
    datetime: '15/09/23',
  },
  {
    buy_price: 984233,
    sell_price: 951805,
    datetime: '16/09/23',
  },
  {
    buy_price: 983111,
    sell_price: 949737,
    datetime: '17/09/23',
  },
  {
    buy_price: 987155,
    sell_price: 954621,
    datetime: '18/09/23',
  },
  {
    buy_price: 990210,
    sell_price: 957569,
    datetime: '19/09/23',
  },
  {
    buy_price: 994655,
    sell_price: 961888,
    datetime: '20/09/23',
  },
  {
    buy_price: 992968,
    sell_price: 960243,
    datetime: '21/09/23',
  },
  {
    buy_price: 986299,
    sell_price: 953595,
    datetime: '22/09/23',
  },
  {
    buy_price: 983742,
    sell_price: 951333,
    datetime: '23/09/23',
  },
  {
    buy_price: 983200,
    sell_price: 950164,
    datetime: '24/09/23',
  },
  {
    buy_price: 986425,
    sell_price: 953920,
    datetime: '25/09/23',
  },
  {
    buy_price: 986470,
    sell_price: 953972,
    datetime: '26/09/23',
  },
  {
    buy_price: 981032,
    sell_price: 948753,
    datetime: '27/09/23',
  },
  {
    buy_price: 973637,
    sell_price: 941541,
    datetime: '28/09/23',
  },
  {
    buy_price: 966359,
    sell_price: 934524,
    datetime: '29/09/23',
  },
  {
    buy_price: 954067,
    sell_price: 922625,
    datetime: '30/09/23',
  },
  {
    buy_price: 952524,
    sell_price: 920485,
    datetime: '01/10/23',
  },
  {
    buy_price: 953322,
    sell_price: 921917,
    datetime: '02/10/23',
  },
  {
    buy_price: 950937,
    sell_price: 919588,
    datetime: '03/10/23',
  },
  {
    buy_price: 961302,
    sell_price: 929606,
    datetime: '04/10/23',
  },
  {
    buy_price: 948396,
    sell_price: 917147,
    datetime: '05/10/23',
  },
  {
    buy_price: 954790,
    sell_price: 923318,
    datetime: '06/10/23',
  },
  {
    buy_price: 954719,
    sell_price: 922841,
    datetime: '07/10/23',
  },
  {
    buy_price: 953838,
    sell_price: 921990,
    datetime: '08/10/23',
  },
  {
    buy_price: 969002,
    sell_price: 937058,
    datetime: '09/10/23',
  },
  {
    buy_price: 978058,
    sell_price: 945820,
    datetime: '10/10/23',
  },
  {
    buy_price: 980175,
    sell_price: 947873,
    datetime: '11/10/23',
  },
  {
    buy_price: 982776,
    sell_price: 950403,
    datetime: '12/10/23',
  },
  {
    buy_price: 1006456,
    sell_price: 973295,
    datetime: '13/10/23',
  },
  {
    buy_price: 1009693,
    sell_price: 975683,
    datetime: '14/10/23',
  },
  {
    buy_price: 1009686,
    sell_price: 975365,
    datetime: '15/10/23',
  },
  {
    buy_price: 1009686,
    sell_price: 975365,
    datetime: '16/10/23',
  },
  {
    buy_price: 1010361,
    sell_price: 977082,
    datetime: '17/10/23',
  },
  {
    buy_price: 1028706,
    sell_price: 994825,
    datetime: '18/10/23',
  },
  {
    buy_price: 1033311,
    sell_price: 999251,
    datetime: '19/10/23',
  },
  {
    buy_price: 1053932,
    sell_price: 1019188,
    datetime: '20/10/23',
  },
  {
    buy_price: 1048809,
    sell_price: 1014241,
    datetime: '21/10/23',
  },
  {
    buy_price: 1046230,
    sell_price: 1011179,
    datetime: '22/10/23',
  },
  {
    buy_price: 1051007,
    sell_price: 1016375,
    datetime: '23/10/23',
  },
  {
    buy_price: 1048479,
    sell_price: 1013925,
    datetime: '24/10/23',
  },
  {
    buy_price: 1048426,
    sell_price: 1013869,
    datetime: '25/10/23',
  },
  {
    buy_price: 1053953,
    sell_price: 1019245,
    datetime: '26/10/23',
  },
  {
    buy_price: 1055010,
    sell_price: 1020226,
    datetime: '27/10/23',
  },
  {
    buy_price: 1062599,
    sell_price: 1027576,
    datetime: '28/10/23',
  },
  {
    buy_price: 1061875,
    sell_price: 1025864,
    datetime: '29/10/23',
  },
  {
    buy_price: 1063211,
    sell_price: 1028163,
    datetime: '30/10/23',
  },
  {
    buy_price: 1060658,
    sell_price: 1025735,
    datetime: '31/10/23',
  },
  {
    buy_price: 1055413,
    sell_price: 1020529,
    datetime: '01/11/23',
  },
  {
    buy_price: 1050511,
    sell_price: 1015789,
    datetime: '02/11/23',
  },
  {
    buy_price: 1047171,
    sell_price: 1012650,
    datetime: '03/11/23',
  },
  {
    buy_price: 1035993,
    sell_price: 1001846,
    datetime: '04/11/23',
  },
  {
    buy_price: 1035831,
    sell_price: 1001268,
    datetime: '05/11/23',
  },
  {
    buy_price: 1035191,
    sell_price: 1001060,
    datetime: '06/11/23',
  },
  {
    buy_price: 1025925,
    sell_price: 992100,
    datetime: '07/11/23',
  },
  {
    buy_price: 1026583,
    sell_price: 992741,
    datetime: '08/11/23',
  },
  {
    buy_price: 1021335,
    sell_price: 987671,
    datetime: '09/11/23',
  },
  {
    buy_price: 1024375,
    sell_price: 990580,
    datetime: '10/11/23',
  },
  {
    buy_price: 1013032,
    sell_price: 979650,
    datetime: '11/11/23',
  },
  {
    buy_price: 1012255,
    sell_price: 977991,
    datetime: '12/11/23',
  },
  {
    buy_price: 1016095,
    sell_price: 982602,
    datetime: '13/11/23',
  },
  {
    buy_price: 1021960,
    sell_price: 988213,
    datetime: '14/11/23',
  },
  {
    buy_price: 1018488,
    sell_price: 984908,
    datetime: '15/11/23',
  },
  {
    buy_price: 1025423,
    sell_price: 991620,
    datetime: '16/11/23',
  },
  {
    buy_price: 1025534,
    sell_price: 991697,
    datetime: '17/11/23',
  },
  {
    buy_price: 1018244,
    sell_price: 984156,
    datetime: '18/11/23',
  },
  {
    buy_price: 1015969,
    sell_price: 981956,
    datetime: '19/11/23',
  },
  {
    buy_price: 1017937,
    sell_price: 984350,
    datetime: '20/11/23',
  },
  {
    buy_price: 1031950,
    sell_price: 997930,
    datetime: '21/11/23',
  },
  {
    buy_price: 1040197,
    sell_price: 1005913,
    datetime: '22/11/23',
  },
  {
    buy_price: 1037107,
    sell_price: 1002899,
    datetime: '23/11/23',
  },
  {
    buy_price: 1040620,
    sell_price: 1006179,
    datetime: '24/11/23',
  },
  {
    buy_price: 1034823,
    sell_price: 1000590,
    datetime: '25/11/23',
  },
  {
    buy_price: 1034173,
    sell_price: 999827,
    datetime: '26/11/23',
  },
  {
    buy_price: 1042216,
    sell_price: 1007746,
    datetime: '27/11/23',
  },
  {
    buy_price: 1045662,
    sell_price: 1011198,
    datetime: '28/11/23',
  },
  {
    buy_price: 1050534,
    sell_price: 1015876,
    datetime: '29/11/23',
  },
  {
    buy_price: 1059487,
    sell_price: 1024532,
    datetime: '30/11/23',
  },
  {
    buy_price: 1057881,
    sell_price: 1023020,
    datetime: '01/12/23',
  },
  {
    buy_price: 1066781,
    sell_price: 1031294,
    datetime: '02/12/23',
  },
  {
    buy_price: 1063250,
    sell_price: 1027881,
    datetime: '03/12/23',
  },
  {
    buy_price: 1101126,
    sell_price: 1062119,
    datetime: '04/12/23',
  },
  {
    buy_price: 1050635,
    sell_price: 1015978,
    datetime: '05/12/23',
  },
  {
    buy_price: 1048836,
    sell_price: 1014250,
    datetime: '06/12/23',
  },
  {
    buy_price: 1053113,
    sell_price: 1018404,
    datetime: '07/12/23',
  },
  {
    buy_price: 1049149,
    sell_price: 1014565,
    datetime: '08/12/23',
  },
  {
    buy_price: 1038535,
    sell_price: 1003663,
    datetime: '09/12/23',
  },
  {
    buy_price: 1038467,
    sell_price: 1003059,
    datetime: '10/12/23',
  },
  {
    buy_price: 1040903,
    sell_price: 1006635,
    datetime: '11/12/23',
  },
  {
    buy_price: 1033533,
    sell_price: 999448,
    datetime: '12/12/23',
  },
  {
    buy_price: 1032058,
    sell_price: 998041,
    datetime: '13/12/23',
  },
  {
    buy_price: 1053308,
    sell_price: 1018549,
    datetime: '14/12/23',
  },
  {
    buy_price: 1058431,
    sell_price: 1023521,
    datetime: '15/12/23',
  },
  {
    buy_price: 1050333,
    sell_price: 1015700,
    datetime: '16/12/23',
  },
  {
    buy_price: 1043474,
    sell_price: 1007814,
    datetime: '17/12/23',
  },
  {
    buy_price: 1046208,
    sell_price: 1011686,
    datetime: '18/12/23',
  },
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
    buy_price: 1412020,
    sell_price: 1365423,
    datetime: '19/12/24 - 22:46',
  },
];

export const fiveYearChart = {
  jsonapi: {
    version: '1.0',
  },
  data: {
    type: 'gold-price',
    attributes: {
      price: 726532,
      percentage: 105.99,
      movement: 'profit',
      prices: filterPricesRecords(fiveYearPricesData, ['01', '15']),
    },
  },
};
