package com.repik.lavagestion.data.local

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "auth_prefs")

class AuthPreferences(private val context: Context) {

    companion object {
        private val TOKEN_KEY = stringPreferencesKey("token")
        private val TENANT_NAME_KEY = stringPreferencesKey("tenant_name")
        private val TENANT_SLUG_KEY = stringPreferencesKey("tenant_slug")
        private val USER_NAME_KEY = stringPreferencesKey("user_name")
    }

    val token: Flow<String?> = context.dataStore.data.map { it[TOKEN_KEY] }
    val tenantName: Flow<String?> = context.dataStore.data.map { it[TENANT_NAME_KEY] }

    suspend fun saveSession(token: String, tenantName: String, tenantSlug: String, userName: String) {
        context.dataStore.edit { prefs ->
            prefs[TOKEN_KEY] = token
            prefs[TENANT_NAME_KEY] = tenantName
            prefs[TENANT_SLUG_KEY] = tenantSlug
            prefs[USER_NAME_KEY] = userName
        }
    }

    suspend fun clearSession() {
        context.dataStore.edit { it.clear() }
    }
}
