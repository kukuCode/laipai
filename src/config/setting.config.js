import $mAssetsPath from './assets.config';
import $mConstData from './constData.config';
class Setting {
	constructor(
		appName,
		appLogo,
		appServiceType,
		appServiceQr,
		isOpenScan,
		styleLoadingIsOpen,
		styleLoadingType,
		styleType,
		productPosterTitle,
		closeLogin,
		closeRegister,
		closeThirdPartyLogin,
		styleCateType,
		styleLoginType
	) {
		this._appName = appName; // 应用名称
		this._appLogo = appLogo; // 应用Logo
		this._appServiceType = appServiceType; // 客服显示类型
		this._appServiceQr = appServiceQr; // 客服二维码
		this._isOpenScan = isOpenScan; // 开启扫一扫入口
		this._styleLoadingIsOpen = styleLoadingIsOpen; // 开启加载
		this._styleLoadingType = styleLoadingType; // 用户可否自定义风格
		this._styleType = styleType; // 全局风格
		

		this._productPosterTitle = productPosterTitle; // 商品海报推广语
		
		this._closeLogin = closeLogin; // 关闭登录
		this._closeRegister = closeRegister; // 关闭注册
		this._closeThirdPartyLogin = closeThirdPartyLogin; // 关闭第三方授权登录

		this._styleCateType = styleCateType; // 分类风格
		this._styleLoginType = styleLoginType; // 登录注册页面风格
	}

	get styleCateType() {
		return this._styleCateType;
	}

	set styleCateType(value) {
		this._styleCateType = value;
	}

	get styleLoginType() {
		return this._styleLoginType;
	}

	set styleLoginType(value) {
		this._styleLoginType = value;
	}

	get closeLogin() {
		return this._closeLogin;
	}

	set closeLogin(value) {
		this._closeLogin = value;
	}

	get closeRegister() {
		return this._closeRegister;
	}

	set closeRegister(value) {
		this._closeRegister = value;
	}

	get productPosterTitle() {
		return this._productPosterTitle;
	}

	set productPosterTitle(value) {
		this._productPosterTitle = value;
	}

	get closeThirdPartyLogin() {
		return this._closeThirdPartyLogin;
	}

	set closeThirdPartyLogin(value) {
		this._closeThirdPartyLogin = value;
	}

	get styleType() {
		return this._styleType;
	}

	set styleType(value) {
		this._styleType = value;
	}

	get appName() {
		return this._appName;
	}

	set appName(value) {
		this._appName = value;
	}

	get appLogo() {
		return this._appLogo;
	}

	set appLogo(value) {
		this._appLogo = value;
	}

	get appServiceType() {
		return this._appServiceType;
	}

	set appServiceType(value) {
		this._appServiceType = value;
	}

	get appServiceQr() {
		return this._appServiceQr;
	}

	set appServiceQr(value) {
		this._appServiceQr = value;
	}

	get isOpenScan() {
		return this._isOpenScan;
	}

	set isOpenScan(value) {
		this._isOpenScan = value;
	}

	get styleLoadingIsOpen() {
		return this._styleLoadingIsOpen;
	}

	set styleLoadingIsOpen(value) {
		this._styleLoadingIsOpen = value;
	}

	get styleLoadingType() {
		return this._styleLoadingType;
	}

	set styleLoadingType(value) {
		this._styleLoadingType = value;
	}
}
export default new Setting(
	$mConstData.appName,
	$mAssetsPath.logo,
	'1', //客户显示类型
	$mAssetsPath.logo, // 客服二维码
	false,// 开启扫一扫入口
	true, // 开启全局加载loading
	'loop',// 自定义加载loading风格
	'red', // 全局风格
	'为您挑选了一个好物', // 商品海报推广语
	false, // 关闭登录
	false, // 关闭注册
	false, // 关闭第三方授权登录
	'one_two_three_cover', // one_two_three_cover 三级分类有图 one_two_three_text 三级分类无图
	'two'	// 登录风格一 登录风格二
);
