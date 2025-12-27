export class UserConst {
  static token: string | null = null;
  static id: number | null = null;
  static userName: string | null = null;

  static name: string | null = null;
  static email: string | null = null;
  static mobile: string | null = null;
  static country: string | null = null;
  static profileImage: string | null = null;

  static dob: string | null = null;
  static gender: string | null = null;
  static address: string | null = null;

  static isEmailVerified: boolean = false;
  static isMobileVerified: boolean = false;
  static isKycVerified: boolean = false;
  static isBankVerified: boolean = false;

  static level: number | null = null;

  static isWithdrawlAllowed: boolean = false;
  static isDepositAllowed: boolean = false;
  static isPromotionalAllowed: boolean = false;
  static isTransferAllowed: boolean = false;
  static isMt5DepositAllowed: boolean = false;
  static isMt5WithdrawlAllowed: boolean = false;

  /**
   * LOGIN RESPONSE SETTER
   */
 static setUser(data: any) {
    const d = data?.userData;

    this.token = data?.token || null;
    this.id = d?.id || null;
    this.userName = d?.userName || null;

    // FIX: Name proper store karo
    this.name = d?.name && d?.name.trim() !== "" ? d.name : "User Name";

    this.email = d?.email || "";
    this.mobile = d?.mobile || "";
    this.country = d?.country || "";
    this.profileImage = d?.profileImage || "";

    this.dob = d?.dob || "";
    this.gender = d?.gender || "";
    this.address = d?.address || "";

    this.isEmailVerified = !!d?.isEmailVerified;
    this.isMobileVerified = !!d?.isMobileVerified;
    this.isKycVerified = !!d?.isKycVerified;
    this.isBankVerified = !!d?.isBankVerified;

    this.level = d?.level || 0;

    this.isWithdrawlAllowed = !!d?.isWithdrawlAllowed;
    this.isDepositAllowed = !!d?.isDepositeAllowed;
    this.isPromotionalAllowed = !!d?.isPromotionalAllowed;
    this.isTransferAllowed = !!d?.isTransferAllowed;
    this.isMt5DepositAllowed = !!d?.isMt5DepositAllowed;
    this.isMt5WithdrawlAllowed = !!d?.isMt5WithdrawlAllowed;
}


  /**
   * PROFILE UPDATE RESPONSE SETTER
   */
  static updateProfile(data: any) {
    this.name = data?.name || this.name;
    this.mobile = data?.mobile || this.mobile;
    this.country = data?.country || this.country;
    this.profileImage = data?.profileImage || this.profileImage;
    this.email = data?.email || this.email;
    this.gender = data?.gender || this.gender;
    this.address = data?.address || this.address;

    // dob fix (convert full ISO to yyyy-mm-dd)
    if (data?.dob) {
      const d = new Date(data.dob);
      this.dob = d.toISOString().split("T")[0];
    }
  }
}
