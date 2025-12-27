import axios from 'axios';

const BASE_URL = 'https://backend.boostbullion.com';

export interface MT5Plan {
  id: number;
  name: string;
  status: string;
  minDeposit: string;
  spread: string;
  commission: string;
  type: 'DEMO' | 'REAL';
  leverage: number | null;
  chipLabel?: string;
}

export interface MT5GroupListResponse {
  success: boolean;
  message: string;
  data?: {
    groupList: MT5Plan[];
    totalPages?: number;
    currentPage?: number;
  };
}

export interface CreateMT5AccountResponse {
  success: boolean;
  message: string;
  data?: {
    accountNumber?: string;
    server?: string;
    leverage?: string;
    [key: string]: any;
  };
}

export interface MT5Account {
  id: number;
  userId: number;
  accountType: 'DEMO' | 'REAL';
  Login: string;
  groupId: number;
  Name: string;
  Country: string;
  Phone: string;
  Email: string;
  Leverage: string;
  Balance: string;
  Credit: string;
  BalancePrevDay: string;
  BalancePrevMonth: string;
  EquityPrevDay: string;
  EquityPrevMonth: string;
  Registration: string;
  LastAccess: string;
  group: {
    name: string;
    leverage: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MT5AccountListResponse {
  success: boolean;
  message: string;
  data?: {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    mt5AccountList: MT5Account[];
  };
}

/**
 * Fetch MT5 Group List (Plans)
 */
export const getMT5GroupList = async (
  token: string,
  page: number = 1,
  sizePerPage: number = 10
): Promise<MT5GroupListResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/mt5/group/list`,
      {
        params: { page, sizePerPage },
        headers: {
          'Authorization': token,
        },
      }
    );

    console.log('MT5 Group List Response:', response.data);
    console.log('Status Code:', response.status);

    if (response.status === 200 && response.data?.status === true) {
      // Transform the data to match our interface
      const groupList = (response.data.data?.groupList || []).map((group: any) => ({
        id: group.id || 0,
        name: group.name || 'Unknown',
        status: group.status || 'ACTIVE',
        minDeposit: group.minDeposit || '0 USD',
        spread: group.spread || 'From 0.00',
        commission: group.commission || 'No commission',
        type: group.type || 'REAL',
        leverage: group.leverage,
        chipLabel: group.status === 'ACTIVE' ? 'Professional' : 'Standard',
      }));

      return {
        success: true,
        message: response.data.message || 'Plans fetched successfully',
        data: {
          groupList,
          totalPages: response.data.data?.totalPages,
          currentPage: response.data.data?.currentPage,
        },
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to fetch MT5 group list',
      };
    }
  } catch (error: any) {
    console.error('MT5 Group List Error:', error.message);
    console.error('Error Response:', error.response?.data);

    return {
      success: false,
      message: error.response?.data?.message || `Error: ${error.message}`,
    };
  }
};

/**
 * Create MT5 Account
 */
export const createMT5Account = async (
  token: string,
  groupId: number,
  leverage: string,
  mainPassword: string
): Promise<CreateMT5AccountResponse> => {
  try {
    console.log('Creating MT5 Account with leverage:', leverage);

    const formData = new URLSearchParams();
    formData.append('groupId', groupId.toString());
    formData.append('Leverage', leverage);
    formData.append('PassMain', mainPassword);

    const response = await axios.post(
      `${BASE_URL}/user/mt5/create/account`,
      formData,
      {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('Create MT5 Account Response:', response.data);
    console.log('Status Code:', response.status);

    if (response.status === 200 && response.data?.status === true) {
      return {
        success: true,
        message: response.data.message || 'Account created successfully',
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to create MT5 account',
      };
    }
  } catch (error: any) {
    console.error('Create MT5 Account Error:', error.message);
    console.error('Error Response:', error.response?.data);

    return {
      success: false,
      message: error.response?.data?.message || `Error: ${error.message}`,
    };
  }
};

/**
 * Get MT5 Account List
 */
export const getMT5AccountList = async (
  token: string,
  page: number = 1,
  sizePerPage: number = 10
): Promise<MT5AccountListResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/mt5/account/list`,
      {
        params: { page, sizePerPage },
        headers: {
          'Authorization': token,
        },
      }
    );

    console.log('MT5 Account List Response:', response.data);
    console.log('Status Code:', response.status);

    if (response.status === 200 && response.data?.status === true) {
      return {
        success: true,
        message: response.data.message || 'Accounts fetched successfully',
        data: {
          totalRecords: response.data.data?.totalRecords || 0,
          totalPages: response.data.data?.totalPages || 0,
          currentPage: response.data.data?.currentPage || 1,
          mt5AccountList: response.data.data?.mt5AccountList || [],
        },
      };
    } else {
      return {
        success: false,
        message: response.data?.message || 'Failed to fetch MT5 accounts',
      };
    }
  } catch (error: any) {
    console.error('MT5 Account List Error:', error.message);
    console.error('Error Response:', error.response?.data);

    return {
      success: false,
      message: error.response?.data?.message || `Error: ${error.message}`,
    };
  }
};