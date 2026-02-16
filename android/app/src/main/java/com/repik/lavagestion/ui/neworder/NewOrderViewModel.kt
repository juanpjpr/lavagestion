package com.repik.lavagestion.ui.neworder

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.repik.lavagestion.data.api.RetrofitClient
import com.repik.lavagestion.data.model.CreateOrderRequest
import com.repik.lavagestion.data.model.OrderItemRequest
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ItemForm(
    val description: String = "",
    val quantity: Int = 1,
    val unitPrice: String = ""
)

data class NewOrderUiState(
    val clientName: String = "",
    val clientPhone: String = "",
    val notes: String = "",
    val items: List<ItemForm> = listOf(ItemForm()),
    val isLoading: Boolean = false,
    val error: String? = null,
    val isSuccess: Boolean = false
)

class NewOrderViewModel : ViewModel() {

    private val _state = MutableStateFlow(NewOrderUiState())
    val state = _state.asStateFlow()

    fun updateClientName(value: String) {
        _state.value = _state.value.copy(clientName = value)
    }

    fun updateClientPhone(value: String) {
        _state.value = _state.value.copy(clientPhone = value)
    }

    fun updateNotes(value: String) {
        _state.value = _state.value.copy(notes = value)
    }

    fun updateItem(index: Int, item: ItemForm) {
        val items = _state.value.items.toMutableList()
        items[index] = item
        _state.value = _state.value.copy(items = items)
    }

    fun addItem() {
        _state.value = _state.value.copy(items = _state.value.items + ItemForm())
    }

    fun removeItem(index: Int) {
        if (_state.value.items.size <= 1) return
        val items = _state.value.items.toMutableList()
        items.removeAt(index)
        _state.value = _state.value.copy(items = items)
    }

    fun getTotal(): Double {
        return _state.value.items.sumOf { item ->
            val price = item.unitPrice.toDoubleOrNull() ?: 0.0
            price * item.quantity
        }
    }

    fun createOrder() {
        val s = _state.value
        val validItems = s.items.filter {
            it.description.isNotBlank() && (it.unitPrice.toDoubleOrNull() ?: 0.0) > 0
        }

        if (validItems.isEmpty()) {
            _state.value = s.copy(error = "Agregá al menos una prenda con precio")
            return
        }

        viewModelScope.launch {
            _state.value = s.copy(isLoading = true, error = null)
            try {
                RetrofitClient.api.createOrder(
                    CreateOrderRequest(
                        clientName = s.clientName,
                        clientPhone = s.clientPhone,
                        items = validItems.map {
                            OrderItemRequest(
                                description = it.description,
                                quantity = it.quantity,
                                unitPrice = it.unitPrice.toDouble()
                            )
                        },
                        notes = s.notes.ifBlank { null }
                    )
                )
                _state.value = _state.value.copy(isLoading = false, isSuccess = true)
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = e.message ?: "Error al crear pedido"
                )
            }
        }
    }
}
