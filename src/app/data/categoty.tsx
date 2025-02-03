export type Subcategory = {
  name: string;
  subcategories?: Subcategory[]; // Mảng con, có thể lồng nhau
};

export type Category = {
  name: string;
  subcategories: Subcategory[]; // Mảng các subcategory
};

const fakeCategories: Category[] = [
  {
    name: "Thời trang giữ ẩm",
    subcategories: [
      {
        name: "Áo khoác",
        subcategories: [
          { name: "Áo khoác lông vũ" },
          { name: "Áo khoác gió" },
          { name: "Áo khoác nỉ" },
        ],
      },
      {
        name: "Áo",
        subcategories: [
          { name: "Áo thun dài tay" },
          { name: "Áo len" },
          { name: "Áo sơ mi" },
        ],
      },
    ],
  },
  {
    name: "Nữ",
    subcategories: [
      {
        name: "Áo",
        subcategories: [
          { name: "Áo thun" },
          { name: "Áo sơ mi" },
          { name: "Áo crop top" },
        ],
      },
      {
        name: "Giày",
        subcategories: [{ name: "Giày cao gót" }, { name: "Giày búp bê" }],
      },
    ],
  },
  {
    name: "Nam",
    subcategories: [
      {
        name: "Áo",
        subcategories: [{ name: "Áo sơ mi" }, { name: "Áo polo" }],
      },
      {
        name: "Quần",
        subcategories: [{ name: "Quần jeans" }, { name: "Quần short" }],
      },
    ],
  },
  {
    name: "Trẻ em",
    subcategories: [
      {
        name: "Áo",
        subcategories: [
          { name: "Áo thun trẻ em" },
          { name: "Áo khoác trẻ em" },
        ],
      },
      {
        name: "Đồ chơi",
        subcategories: [{ name: "Búp bê" }, { name: "Đồ chơi xếp hình" }],
      },
    ],
  },
  {
    name: "Giày dép",
    subcategories: [
      {
        name: "Giày",
        subcategories: [{ name: "Giày thể thao" }, { name: "Giày da" }],
      },
      {
        name: "Dép",
        subcategories: [{ name: "Dép xỏ ngón" }, { name: "Dép quai hậu" }],
      },
    ],
  },
  {
    name: "Phụ kiện",
    subcategories: [
      {
        name: "Túi xách",
        subcategories: [{ name: "Túi vải" }, { name: "Túi da" }],
      },
      {
        name: "Thắt lưng",
        subcategories: [{ name: "Thắt lưng da" }, { name: "Thắt lưng vải" }],
      },
    ],
  },
  {
    name: "Mỹ phẩm - Làm đẹp",
    subcategories: [
      {
        name: "Chăm sóc da",
        subcategories: [{ name: "Kem dưỡng ẩm" }, { name: "Serum" }],
      },
      {
        name: "Trang điểm",
        subcategories: [{ name: "Son môi" }, { name: "Phấn phủ" }],
      },
    ],
  },
  {
    name: "Nhà cửa - Đời sống",
    subcategories: [
      {
        name: "Đồ bếp",
        subcategories: [{ name: "Nồi cơm điện" }, { name: "Chảo chống dính" }],
      },
      {
        name: "Trang trí",
        subcategories: [{ name: "Đèn trang trí" }, { name: "Khung ảnh" }],
      },
    ],
  },
  {
    name: "Tin tức",
    subcategories: [],
  },
  {
    name: "Mua voucher",
    subcategories: [
      {
        name: "Giảm giá",
        subcategories: [{ name: "Voucher 50k" }, { name: "Voucher 100k" }],
      },
      {
        name: "Giảm giá",
        subcategories: [{ name: "Voucher 50k" }, { name: "Voucher 100k" }],
      },
      {
        name: "Giảm giá",
        subcategories: [{ name: "Voucher 50k" }, { name: "Voucher 100k" }],
      },
      {
        name: "Giảm giá",
        subcategories: [{ name: "Voucher 50k" }, { name: "Voucher 100k" }],
      },
      {
        name: "Giảm giá",
        subcategories: [{ name: "Voucher 50k" }, { name: "Voucher 100k" }],
      },
      {
        name: "Giảm giá",
        subcategories: [{ name: "Voucher 50k" }, { name: "Voucher 100k" }],
      },
    ],
  },
];

export default fakeCategories;
