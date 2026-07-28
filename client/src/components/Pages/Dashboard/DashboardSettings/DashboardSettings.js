import React, { useEffect, useState } from 'react';
import { verifyAdmin, changePassword, updateAdminName } from '../../../../api/auth';
import { fetchSettings, updateSettings } from '../../../../api/settings';

function DashboardSettings() {
  const [name, setName] = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameMessage, setNameMessage] = useState('');
  const [nameError, setNameError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [storeSettings, setStoreSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');
  const [settingsError, setSettingsError] = useState('');

  useEffect(() => {
    verifyAdmin()
      .then((data) => setName(data.name || ''))
      .catch((error) => console.error('Erro ao buscar dados do admin:', error));

    fetchSettings()
      .then(setStoreSettings)
      .catch((error) => {
        console.error('Erro ao buscar configurações da loja:', error);
        setSettingsError('Não foi possível carregar as configurações da loja.');
      })
      .finally(() => setSettingsLoading(false));
  }, []);

  async function handleNameSubmit(e) {
    e.preventDefault();
    setNameMessage('');
    setNameError('');
    setNameSaving(true);
    try {
      await updateAdminName(name.trim());
      setNameMessage('Nome atualizado com sucesso.');
    } catch (err) {
      setNameError(err.data?.message || 'Não foi possível atualizar o nome.');
    } finally {
      setNameSaving(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('A confirmação não bate com a nova senha.');
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMessage('Senha atualizada com sucesso.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.data?.message || 'Não foi possível trocar a senha.');
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleSettingsSubmit(e) {
    e.preventDefault();
    setSettingsMessage('');
    setSettingsError('');
    setSettingsSaving(true);
    try {
      const updated = await updateSettings(storeSettings);
      setStoreSettings(updated);
      setSettingsMessage('Configurações da loja atualizadas com sucesso.');
    } catch (err) {
      setSettingsError(err.data?.message || 'Não foi possível atualizar as configurações da loja.');
    } finally {
      setSettingsSaving(false);
    }
  }

  const handleSettingsFieldChange = (field) => (e) => {
    setStoreSettings((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <>
      <header className="dashboard-header">
        <h1>Configurações</h1>
        <p className="dashboard-subtitle">Perfil do admin e dados da loja</p>
      </header>

      <div className="dashboard-content">
        <section className="content-section">
          <h2>Perfil</h2>
          <form className="settings-form" onSubmit={handleNameSubmit}>
            <div className="form-group">
              <label htmlFor="adminName">Nome de exibição</label>
              <input
                type="text"
                id="adminName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {nameMessage && <p className="settings-success">{nameMessage}</p>}
            {nameError && <p className="settings-error">{nameError}</p>}
            <button type="submit" className="action-btn" disabled={nameSaving}>
              {nameSaving ? 'Salvando...' : 'Salvar nome'}
            </button>
          </form>
        </section>

        <section className="content-section">
          <h2>Segurança</h2>
          <form className="settings-form" onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Senha atual</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Nova senha</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar nova senha</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            {passwordMessage && <p className="settings-success">{passwordMessage}</p>}
            {passwordError && <p className="settings-error">{passwordError}</p>}
            <button type="submit" className="action-btn" disabled={passwordSaving}>
              {passwordSaving ? 'Salvando...' : 'Trocar senha'}
            </button>
          </form>
        </section>

        <section className="content-section">
          <h2>Dados da Loja</h2>
          {settingsLoading ? (
            <p className="empty-state">Carregando...</p>
          ) : !storeSettings ? (
            <p className="empty-state">{settingsError || 'Não foi possível carregar.'}</p>
          ) : (
            <form className="settings-form" onSubmit={handleSettingsSubmit}>
              <div className="form-group">
                <label htmlFor="whatsappPhone">WhatsApp (só números, com DDI e DDD)</label>
                <input
                  type="text"
                  id="whatsappPhone"
                  value={storeSettings.whatsappPhone}
                  onChange={handleSettingsFieldChange('whatsappPhone')}
                  placeholder="5531971842477"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">E-mail de contato</label>
                <input
                  type="email"
                  id="contactEmail"
                  value={storeSettings.contactEmail}
                  onChange={handleSettingsFieldChange('contactEmail')}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="hoursWeekdays">Horário - Seg a Sex</label>
                <input
                  type="text"
                  id="hoursWeekdays"
                  value={storeSettings.hoursWeekdays}
                  onChange={handleSettingsFieldChange('hoursWeekdays')}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="hoursSaturday">Horário - Sábado</label>
                <input
                  type="text"
                  id="hoursSaturday"
                  value={storeSettings.hoursSaturday}
                  onChange={handleSettingsFieldChange('hoursSaturday')}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="hoursSunday">Horário - Domingo</label>
                <input
                  type="text"
                  id="hoursSunday"
                  value={storeSettings.hoursSunday}
                  onChange={handleSettingsFieldChange('hoursSunday')}
                  required
                />
              </div>
              {settingsMessage && <p className="settings-success">{settingsMessage}</p>}
              {settingsError && <p className="settings-error">{settingsError}</p>}
              <button type="submit" className="action-btn" disabled={settingsSaving}>
                {settingsSaving ? 'Salvando...' : 'Salvar configurações da loja'}
              </button>
            </form>
          )}
        </section>
      </div>
    </>
  );
}

export default DashboardSettings;
