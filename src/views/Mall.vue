<template>
  <el-row :gutter="20" class="mall-page">
    <!-- 商品列表区域 -->
    <el-col :span="16">
      <el-card>
        <div class="mall-header">
          <el-input
            v-model="search"
            placeholder="搜索商品名称/分类"
            prefix-icon="el-icon-search"
            class="search-input"
            clearable
            @clear="handleSearch"
            @input="handleSearch"
          />
          <el-button type="primary" @click="openAddDialog">添加商品</el-button>
        </div>
        <el-table
          :data="filteredProducts"
          style="width: 100%;"
          @row-click="handleRowClick"
          highlight-current-row
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="商品" prop="name">
            <template #default="scope">
              <div class="product-info">
                <img :src="scope.row.image" class="product-img" />
                <div>
                  <div class="product-name">{{ scope.row.name }}</div>
                  <div class="product-desc">{{ scope.row.desc }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格" prop="price" width="100">
            <template #default="scope">
              ￥{{ scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column label="库存" prop="stock" width="80" />
          <el-table-column label="销量" prop="sales" width="80" />
          <el-table-column label="操作" width="160">
            <template #default="scope">
              <el-button size="small" @click.stop="openEditDialog(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click.stop="deleteProduct(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <!-- 商品详情区域 -->
    <el-col :span="8">
      <el-card class="product-detail">
        <div class="detail-header">商品详情</div>
        <div v-if="selectedProduct" class="detail-content">
          <img :src="selectedProduct.image" class="detail-img" />
          <div class="detail-info-right">
            <div class="detail-name">{{ selectedProduct.name }}</div>
            <div class="detail-desc">{{ selectedProduct.desc }}</div>
            <div class="detail-info-row">
              <span>价格：</span><b>￥{{ selectedProduct.price }}</b>
            </div>
            <div class="detail-info-row">
              <span>库存：</span><b>{{ selectedProduct.stock }}</b>
            </div>
            <div class="detail-info-row">
              <span>销量：</span><b>{{ selectedProduct.sales }}</b>
            </div>
            <el-button type="primary" @click="openEditDialog(selectedProduct)">编辑商品</el-button>
          </div>
        </div>
        <div v-else class="empty-detail">请选择左侧商品查看详情</div>
      </el-card>
    </el-col>

    <!-- 编辑商品对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑商品" width="400px">
      <el-form :model="editForm" label-width="70px">
        <el-form-item label="名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.desc" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model.number="editForm.price" type="number" min="0" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model.number="editForm.stock" type="number" min="0" />
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model.number="editForm.sales" type="number" min="0" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            :show-file-list="false"
            :before-upload="() => false"
            :on-change="handleImageChange"
            accept="image/*"
          >
            <el-button size="small">上传图片</el-button>
          </el-upload>
          <div v-if="editForm.image" style="margin-top:8px;">
            <img :src="editForm.image" alt="预览" style="width:80px;height:80px;border-radius:8px;object-fit:cover;" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加商品对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加商品" width="400px">
      <el-form :model="addForm" label-width="70px">
        <el-form-item label="名称">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="addForm.desc" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model.number="addForm.price" type="number" min="0" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model.number="addForm.stock" type="number" min="0" />
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model.number="addForm.sales" type="number" min="0" />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            :show-file-list="false"
            :before-upload="() => false"
            :on-change="handleImageChange"
            accept="image/*"
          >
            <el-button size="small">上传图片</el-button>
          </el-upload>
          <div v-if="addForm.image" style="margin-top:8px;">
            <img :src="addForm.image" alt="预览" style="width:80px;height:80px;border-radius:8px;object-fit:cover;" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAdd">添加</el-button>
      </template>
    </el-dialog>
  </el-row>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// 商品数据模拟（增加更多商品）
const products = ref([
  {
    id: 1,
    name: '苹果 iPhone 14',
    desc: 'A15芯片，超视网膜XDR显示屏，5G全网通',
    image: new URL('../assets/images/product1.jpg', import.meta.url).href,
    price: 5999,
    stock: 120,
    sales: 320,
  },
  {
    id: 2,
    name: '华为 Mate 50',
    desc: '骁龙8+旗舰芯片，超光变XMAGE影像',
    image: new URL('../assets/images/product1.jpg', import.meta.url).href,
    price: 4999,
    stock: 88,
    sales: 288,
  },
  {
    id: 3,
    name: 'OPPO Find X6',
    desc: '哈苏影像，超大底三主摄，长续航',
    image: new URL('../assets/images/product1.jpg', import.meta.url).href,
    price: 4599,
    stock: 60,
    sales: 156,
  },
  {
    id: 4,
    name: 'vivo X90',
    desc: '蔡司影像，天玑9200旗舰芯片，120W闪充',
    image: new URL('../assets/images/product1.jpg', import.meta.url).href,
    price: 4299,
    stock: 40,
    sales: 80,
  },
  {
    id: 5,
    name: '小米 13',
    desc: '徕卡影像，第二代骁龙8，120Hz高刷屏',
    image: new URL('../assets/images/product1.jpg', import.meta.url).href,
    price: 3999,
    stock: 70,
    sales: 120,
  },
  {
    id: 6,
    name: '一加 11',
    desc: '第三代骁龙8，120Hz柔性屏，长寿快充',
    image: new URL('../assets/images/product1.jpg', import.meta.url).href,
    price: 3799,
    stock: 200,
    sales: 300,
  },
])

const search = ref('')
const selectedProduct = ref(null)

const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value.filter(
    p =>
      p.name.includes(search.value) ||
      p.desc.includes(search.value)
  )
})

function handleSearch() {
  selectedProduct.value = null
}

function handleRowClick(row) {
  selectedProduct.value = row
}

// 编辑商品
const editDialogVisible = ref(false)
const editForm = reactive({
  id: null,
  name: '',
  desc: '',
  price: 0,
  stock: 0,
  sales: 0,
  image: ''
})

function openEditDialog(product) {
  Object.assign(editForm, product)
  editDialogVisible.value = true
}
function saveEdit() {
  const idx = products.value.findIndex(p => p.id === editForm.id)
  if (idx !== -1) {
    products.value[idx] = { ...editForm }
    // 如果当前详情是这个商品，也要同步
    if (selectedProduct.value && selectedProduct.value.id === editForm.id) {
      selectedProduct.value = products.value[idx]
    }
  }
  editDialogVisible.value = false
}

// 删除商品
function deleteProduct(product) {
  products.value = products.value.filter(p => p.id !== product.id)
  if (selectedProduct.value && selectedProduct.value.id === product.id) {
    selectedProduct.value = null
  }
}

// 添加商品
const addDialogVisible = ref(false)
const addForm = reactive({
  name: '',
  desc: '',
  price: 0,
  stock: 0,
  sales: 0,
  image: ''
})
function openAddDialog() {
  Object.assign(addForm, {
    name: '',
    desc: '',
    price: 0,
    stock: 0,
    sales: 0,
    image: ''
  })
  addDialogVisible.value = true
}
function saveAdd() {
  if (!addForm.name || !addForm.image) {
    // 简单校验
    return
  }
  const newId = Math.max(...products.value.map(p => p.id)) + 1
  products.value.push({ ...addForm, id: newId })
  addDialogVisible.value = false
}

// 上传图片时的本地预览处理
function handleImageChange(file) {
  const reader = new FileReader()
  reader.onload = e => {
    // 这里直接用 base64 作为图片地址
    if (editDialogVisible.value) {
      editForm.image = e.target.result
    } else if (addDialogVisible.value) {
      addForm.image = e.target.result
    }
  }
  reader.readAsDataURL(file.raw)
}
</script>

<style scoped lang="less">
.mall-page {
  margin-top: 30px;
}
.mall-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  .search-input {
    width: 300px;
  }
}
.product-info {
  display: flex;
  align-items: center;
  .product-img {
    width: 48px;
    height: 48px;

    border-radius: 8px;
    margin-right: 12px;
    object-fit: cover;
    // background: url(../assets/images/product1.jpg);
  }
  .product-name {
    font-weight: bold;
    font-size: 16px;
  }
  .product-desc {
    color: #888;
    font-size: 12px;
  }
}
.product-detail {
  min-height: 350px;
  .detail-header {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 12px;
  }
  .detail-content {
    display: flex;
    align-items: flex-start;
    .detail-img {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      object-fit: cover;
      margin-right: 18px;
      background: #f5f5f5;
    }
    .detail-info-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .detail-name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 6px;
      }
      .detail-desc {
        color: #888;
        margin-bottom: 10px;
      }
      .detail-info-row {
        margin-bottom: 8px;
        color: #333;
        span {
          color: #888;
        }
        b {
          color: #222;
          font-weight: bold;
        }
      }
    }
  }
  .empty-detail {
    color: #bbb;
    text-align: center;
    margin-top: 60px;
  }
}
</style>