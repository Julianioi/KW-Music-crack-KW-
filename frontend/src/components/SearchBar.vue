<template>
  <div class="search-bar">
    <div class="input-container">
      <input 
        type="text" 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup.enter="$emit('search')"
        placeholder="输入音乐 ID"
      />
      <button @click="$emit('search')" :disabled="loading">
        {{ loading ? '查询中...' : '查询音乐' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'search']
};
</script>

<style scoped>
.search-bar {
  margin-bottom: 15px;
}

.input-container {
  display: flex;
  gap: 10px;
}

input[type="text"] {
  flex-grow: 1;
  padding: 12px;
  border: 2px solid #ff9900;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus {
  border-color: #e68a00;
}

button {
  padding: 12px 20px;
  background-color: #ff9900;
  border: none;
  color: white;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #e68a00;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
