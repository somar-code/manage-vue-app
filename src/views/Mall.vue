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
        <div class="detail-header">
          商品详情
          <span class="detail-tip">（点击表格行选择商品）</span>
        </div>
        <div class="detail-list-container">
          <div v-if="selectedProducts.length > 0" class="detail-list">
            <div 
              v-for="product in selectedProducts" 
              :key="product.id" 
              class="detail-item"
            >
              <img :src="product.image" class="detail-img" />
              <div class="detail-info-right">
                <div class="detail-name">{{ product.name }}</div>
                <div class="detail-desc">{{ product.desc }}</div>
                <div class="detail-info-row">
                  <span>价格：</span><b>￥{{ product.price }}</b>
                </div>
                <div class="detail-info-row">
                  <span>库存：</span><b>{{ product.stock }}</b>
                </div>
                <div class="detail-info-row">
                  <span>销量：</span><b>{{ product.sales }}</b>
                </div>
                <el-button size="small" type="primary" @click="openEditDialog(product)">编辑商品</el-button>
              </div>
            </div>
          </div>
          <div v-else class="empty-detail">请选择左侧商品查看详情</div>
        </div>
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
const selectedProducts = ref([])

const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value.filter(
    p =>
      p.name.includes(search.value) ||
      p.desc.includes(search.value)
  )
})

function handleSearch() {
  selectedProducts.value = []
}

function handleRowClick(row) {
  // 检查是否已经选中该商品
  const existingIndex = selectedProducts.value.findIndex(p => p.id === row.id)
  if (existingIndex === -1) {
    // 如果未选中，则添加到选中列表
    selectedProducts.value.push(row)
  } else {
    // 如果已选中，则从选中列表中移除
    selectedProducts.value.splice(existingIndex, 1)
  }
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
    if (selectedProducts.value.some(p => p.id === editForm.id)) {
      const updatedProduct = products.value.find(p => p.id === editForm.id)
      const index = selectedProducts.value.findIndex(p => p.id === editForm.id)
      if (index !== -1) {
        selectedProducts.value[index] = updatedProduct
      }
    }
  }
  editDialogVisible.value = false
}

// 删除商品
function deleteProduct(product) {
  products.value = products.value.filter(p => p.id !== product.id)
  if (selectedProducts.value.some(p => p.id === product.id)) {
    selectedProducts.value = selectedProducts.value.filter(p => p.id !== product.id)
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
    .detail-tip {
      font-size: 12px;
      color: #999;
      margin-left: 10px;
      font-weight: normal;
    }
  }
  .detail-list-container {
    height: 400px; /* 设置固定高度，约等于三个商品详情的高度 */
    overflow-y: auto; /* 超出时显示滚动条 */
    padding-right: 5px; /* 为滚动条留出空间 */
    
    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
    
    .detail-list {
      display: flex;
      flex-direction: column;
      gap: 12px; /* 商品之间的间距 */
      .detail-item {
        display: flex;
        align-items: flex-start;
        padding: 12px;
        background-color: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
        transition: all 0.2s ease;
        
        &:hover {
          background-color: #e9ecef;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .detail-img {
          width: 70px;
          height: 70px;
          border-radius: 8px;
          object-fit: cover;
          margin-right: 15px;
          flex-shrink: 0;
        }
        .detail-info-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          .detail-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 4px;
            color: #333;
          }
          .detail-desc {
            color: #666;
            font-size: 12px;
            margin-bottom: 8px;
            line-height: 1.4;
          }
          .detail-info-row {
            margin-bottom: 4px;
            color: #333;
            font-size: 12px;
            span {
              color: #666;
            }
            b {
              color: #222;
              font-weight: bold;
            }
          }
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