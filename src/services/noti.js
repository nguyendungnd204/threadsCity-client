import { database } from '../../firebase';

export const layThongBao = async (userId) => {
  try {
    const snapshot = await database
      .ref('/notifications')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');
    
    const danhSachThongBao = [];
    snapshot.forEach((child) => {
      danhSachThongBao.push({ id: child.key, ...child.val() });
    });
    
    return { thanhCong: true, duLieu: danhSachThongBao };
  } catch (loi) {
    console.error('Lỗi khi lấy thông báo:', loi);
    return { thanhCong: false, thongBao: loi.message || 'Không thể lấy danh sách thông báo' };
  }
};