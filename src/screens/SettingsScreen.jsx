import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useContext } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AuthContext } from "../context/AuthContext";

// --- Componente de item de configuração reutilizável ---
function SettingsItem({ icon, label, sublabel, onPress, danger }) {
  return (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View
        style={[
          styles.settingsItemIcon,
          danger && styles.settingsItemIconDanger,
        ]}
      >
        {icon}
      </View>
      <View style={styles.settingsItemText}>
        <Text
          style={[
            styles.settingsItemLabel,
            danger && styles.settingsItemLabelDanger,
          ]}
        >
          {label}
        </Text>
        {sublabel ? (
          <Text style={styles.settingsItemSublabel}>{sublabel}</Text>
        ) : null}
      </View>
      <Feather
        name="chevron-right"
        size={18}
        color={danger ? "#EF4444" : "#9CA3AF"}
      />
    </TouchableOpacity>
  );
}

// --- Componente de separador de secção ---
function SectionTitle({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

export default function SettingsScreen() {
  const { loggedUser, logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Terminar Sessão",
      "Tem a certeza que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: logout,
        },
      ],
    );
  };

  const handleNotImplemented = () => {
    Alert.alert("Em breve", "Esta funcionalidade ainda não está disponível.");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho da tela */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Configurações</Text>
        <Text style={styles.pageSubtitle}>
          Gerencie a sua conta e preferências
        </Text>
      </View>

      {/* Cartão de perfil do utilizador */}
      <View style={styles.profileCard}>
        <View style={styles.avatarBox}>
          <Feather name="user" size={34} color="#D08700" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{loggedUser || "Utilizador"}</Text>
          <Text style={styles.profileRole}>Operador de Turno</Text>
        </View>
        <View style={styles.profileBadge}>
          <Text style={styles.profileBadgeText}>Ativo</Text>
        </View>
      </View>

      {/* Secção: Conta */}
      <SectionTitle title="CONTA" />
      <View style={styles.settingsGroup}>
        <SettingsItem
          icon={<Feather name="user" size={18} color="#D08700" />}
          label="Perfil"
          sublabel="Nome, função e informações pessoais"
          onPress={handleNotImplemented}
        />
        <View style={styles.divider} />
        <SettingsItem
          icon={<Feather name="lock" size={18} color="#D08700" />}
          label="Palavra-passe"
          sublabel="Alterar palavra-passe de acesso"
          onPress={handleNotImplemented}
        />
        <View style={styles.divider} />
        <SettingsItem
          icon={<Feather name="bell" size={18} color="#D08700" />}
          label="Notificações"
          sublabel="Alertas e lembretes de turno"
          onPress={handleNotImplemented}
        />
      </View>

      {/* Secção: Aplicação */}
      <SectionTitle title="APLICAÇÃO" />
      <View style={styles.settingsGroup}>
        <SettingsItem
          icon={<AntDesign name="clockcircleo" size={18} color="#D08700" />}
          label="Turnos e Horários"
          sublabel="Configurar duração e tipos de turno"
          onPress={handleNotImplemented}
        />
        <View style={styles.divider} />
        <SettingsItem
          icon={<Feather name="database" size={18} color="#D08700" />}
          label="Exportar Dados"
          sublabel="Guardar relatórios em ficheiro"
          onPress={handleNotImplemented}
        />
        <View style={styles.divider} />
        <SettingsItem
          icon={<SimpleLineIcons name="globe" size={18} color="#D08700" />}
          label="Idioma"
          sublabel="Português (Portugal)"
          onPress={handleNotImplemented}
        />
      </View>

      {/* Secção: Suporte */}
      <SectionTitle title="SUPORTE" />
      <View style={styles.settingsGroup}>
        <SettingsItem
          icon={<Feather name="help-circle" size={18} color="#D08700" />}
          label="Ajuda e FAQ"
          sublabel="Tire as suas dúvidas"
          onPress={handleNotImplemented}
        />
        <View style={styles.divider} />
        <SettingsItem
          icon={<Feather name="info" size={18} color="#D08700" />}
          label="Sobre o ShiftSync"
          sublabel="Versão 1.0.0"
          onPress={handleNotImplemented}
        />
      </View>

      {/* Botão de logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Feather
          name="log-out"
          size={18}
          color="#fff"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.logoutText}>Terminar Sessão</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>
        ShiftSync v1.0.0 · Gestão de Turnos
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },

  // Cabeçalho da tela
  pageHeader: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1F2937",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  // Cartão de perfil
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  avatarBox: {
    width: 64,
    height: 64,
    backgroundColor: "#FFFBEB",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FDE68A",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    textTransform: "capitalize",
  },
  profileRole: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },
  profileBadge: {
    backgroundColor: "#D1FAE5",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#6EE7B7",
  },
  profileBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#065F46",
  },

  // Títulos de secção
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9CA3AF",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Grupos de itens de configuração
  settingsGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsItemIcon: {
    width: 36,
    height: 36,
    backgroundColor: "#FFFBEB",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  settingsItemIconDanger: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  settingsItemLabelDanger: {
    color: "#EF4444",
  },
  settingsItemSublabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 66,
  },

  // Botão de logout
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#EF4444",
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  // Rodapé
  versionText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 8,
  },
});
