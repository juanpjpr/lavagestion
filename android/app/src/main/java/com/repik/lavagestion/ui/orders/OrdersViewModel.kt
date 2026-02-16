package com.repik.lavagestion.ui.orders

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.repik.lavagestion.data.api.RetrofitClient
import com.repik.lavagestion.data.model.Order
import com.repik.lavagestion.data.model.UpdateStatusRequest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class OrdersUiState(
    val orders: List<Order> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val selectedFilter: String? = null
)

class OrdersViewModel : ViewModel() {

    private val _state = MutableStateFlow(OrdersUiState())
    val state = _state.asStateFlow()

    init {
        loadOrders()
    }

    fun loadOrders(status: String? = _state.value.selectedFilter) {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null, selectedFilter = status)
            try {
                val response = RetrofitClient.api.getOrders(status = status)
                _state.value = _state.value.copy(orders = response.data, isLoading = false)
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message ?: "Error al cargar pedidos"
                )
            }
        }
    }

    fun updateStatus(orderId: String, newStatus: String) {
        viewModelScope.launch {
            try {
                RetrofitClient.api.updateOrderStatus(orderId, UpdateStatusRequest(newStatus))
                loadOrders()
            } catch (e: Exception) {
                _state.value = _state.value.copy(error = e.message ?: "Error al actualizar estado")
            }
        }
    }
}
